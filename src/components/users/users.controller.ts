import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { messages } from 'src/constants/messages';
import { Role } from 'src/enums/roles';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard, RoleGuard } from '../auth/guards';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
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
