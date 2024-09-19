import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequestDto } from '../auth/dto/auth.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserDetails(userId: number) {
    return this.prisma.user.findFirst({
      where: { id: userId },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async create(prismaClient: PrismaClient, payload: RegisterRequestDto) {
    return prismaClient.user.create({
      data: {
        phone: payload.phone,
        password: payload.password,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
    });
  }

  async insertUserRole(
    prismaClient: PrismaClient,
    userId: number,
    roleId: number,
  ) {
    return prismaClient.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async findRoleByName(role: string) {
    return this.prisma.role.findFirst({
      where: {
        name: role,
      },
    });
  }

  async getUserRole(userId: number) {
    return this.prisma.user.findFirst({
      where: { id: userId },
      select: {
        roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
