import { badRequest } from '@hapi/boom';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { messages } from 'src/constants/messages';
import { UsersRepository } from '../users/users.repository';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { AccessToken } from './types/AccessToken';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async register(registerRequest: RegisterRequestDto): Promise<AccessToken> {
    const { email, password } = registerRequest;
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw badRequest(messages.USER.EMAIL_ALREADY_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { ...registerRequest, password: hashedPassword };
    const user = await this.usersRepository.create(newUser);
    return this.generateAccessToken(user);
  }

  async login(loginRequest: LoginRequestDto): Promise<AccessToken> {
    const { email, password } = loginRequest;
    const user = await this.validateUser(email, password);
    return this.generateAccessToken(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
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

  async generateAccessToken(user: User): Promise<AccessToken> {
    const payload = { email: user.email, id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
