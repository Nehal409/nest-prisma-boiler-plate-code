import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async getUserDetails(userId: number) {
    return this.usersRepository.getUserDetails(userId);
  }
}
