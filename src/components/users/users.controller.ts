import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { messages } from 'src/constants/messages';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get('/')
  async fetchUserDetails(@Req() req) {
    const { userId } = req.user;
    const user = await this.usersService.getUserDetails(userId);
    return {
      message: messages.DATA_FETCHED_SUCCESS,
      data: user,
    };
  }
}
