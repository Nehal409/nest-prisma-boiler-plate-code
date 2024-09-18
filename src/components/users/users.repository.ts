import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async getUserDetails(userId: number) {
    return await this.prisma.user.findFirst({
      where: { id: userId },
    });
  }
}
