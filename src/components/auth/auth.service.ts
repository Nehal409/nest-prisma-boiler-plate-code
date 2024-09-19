import { badRequest } from '@hapi/boom';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { messages } from 'src/constants/messages';
import { Role } from 'src/enums/roles';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from 'winston';
import { UsersRepository } from '../users/users.repository';
import { LoginRequestDto, RegisterRequestDto } from './dto/auth.dto';
import { AccessTokenPayload } from './types/AccessTokenPayload';
import { AccessToken, AuthTokens, RefreshToken } from './types/auth-token';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
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

  async login(loginRequest: LoginRequestDto): Promise<AuthTokens> {
    const { email, password } = loginRequest;
    const user = await this.validateUser(email, password);
    const { id: userId } = user;
    const userRole = await this.getUserRole(userId);
    const { accessToken } = this.generateAccessToken(userId, userRole);
    const { refreshToken } = this.generateRefreshToken(userId);
    return { accessToken, refreshToken };
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw badRequest(messages.USER.INVALID_CREDENTIALS);
    }
    return user;
  }

  private async getUserRole(userId: number): Promise<string | null> {
    // Extract the role name (assuming a user can have multiple roles, we grab the first one)
    // TODO: How to handle user's multiple roles.
    const userRoleData = await this.usersRepository.getUserRole(userId);
    return userRoleData.roles.length > 0
      ? userRoleData.roles[0].role.name
      : null;
  }

  private generateAccessToken(userId: number, role: string): AccessToken {
    const payload = { role, userId };
    return {
      accessToken: this.jwtService.sign(payload), // jwt secret and expiry for access token is passed in the auth.module.
    };
  }

  private generateRefreshToken(userId: number): RefreshToken {
    const payload = { userId };
    return {
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get('jwt.refreshTokenSecret'),
        expiresIn: this.configService.get('jwt.refreshTokenExpiry'),
      }),
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<AccessToken> {
    const payload: AccessTokenPayload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('jwt.refreshTokenSecret'),
    });
    const { userId } = payload;
    const userRole = await this.getUserRole(userId);
    return this.generateAccessToken(userId, userRole);
  }
}
