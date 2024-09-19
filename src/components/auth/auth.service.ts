import { badRequest } from '@hapi/boom';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { messages } from 'src/constants/messages';
import { Role } from 'src/enums/roles';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from 'winston';
import { UsersRepository } from '../users/users.repository';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { AccessToken } from './types/AccessToken';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(registerRequest: RegisterRequestDto): Promise<void> {
    const { email, password, role } = registerRequest;
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw badRequest(messages.USER.EMAIL_ALREADY_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { ...registerRequest, password: hashedPassword };
    return this.prisma.$transaction(async (prismaClient: PrismaClient) => {
      const user = await this.usersRepository.create(prismaClient, newUser);
      await this.saveUserRole(prismaClient, user.id, role);
      this.logger.info(messages.USER.REGISTERED_SUCCESSFULLY);
      return;
    });
  }

  private async saveUserRole(
    prismaClient: PrismaClient,
    userId: number,
    role: Role,
  ): Promise<UserRole> {
    const roleData = await this.usersRepository.findRoleByName(role);
    if (!roleData) {
      throw badRequest(messages.USER.INVALID_ROLE);
    }
    return this.usersRepository.insertUserRole(
      prismaClient,
      userId,
      roleData.id,
    );
  }

  async login(loginRequest: LoginRequestDto): Promise<AccessToken> {
    const { email, password } = loginRequest;
    const user = await this.validateUser(email, password);
    const { id: userId } = user;
    const userRoleData = await this.usersRepository.getUserRole(userId);
    // Extract the role name (assuming a user can have multiple roles, we grab the first one)
    const userRole =
      userRoleData.roles.length > 0 ? userRoleData.roles[0].role.name : null;
    return this.generateAccessToken(userId, userRole);
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw badRequest(messages.USER.NOT_FOUND);
    }
    const isPasswordValid: boolean = bcrypt.compareSync(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw badRequest(messages.USER.INVALID_PASSWORD);
    }
    return user;
  }

  private async generateAccessToken(
    userId: number,
    role: string,
  ): Promise<AccessToken> {
    const payload = { role, userId };
    return { access_token: this.jwtService.sign(payload) };
  }
}
