import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserDetails(userId: number) {
    return this.usersRepository.getUserDetails(userId);
  }
}
