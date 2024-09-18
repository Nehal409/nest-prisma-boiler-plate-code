import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequestDto } from '../auth/dto/register-request.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async getUserDetails(userId: number) {
    return this.prisma.user.findFirst({
      where: { id: userId },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async create(payload: RegisterRequestDto) {
    return this.prisma.user.create({
      data: {
        phone: payload.phone,
        password: payload.password,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
    });
  }
}
