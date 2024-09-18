import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { messages } from 'src/constants/messages';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerBody: RegisterRequestDto) {
    const token = await this.authService.register(registerBody);
    return {
      data: token,
      message: messages.USER.CREATED_SUCCESSFULLY,
    };
  }

  @Post('login')
  async login(@Body() loginBody: LoginRequestDto) {
    const token = await this.authService.login(loginBody);
    return {
      data: token,
      message: messages.USER.LOGGED_IN_SUCCESSFULLY,
    };
  }
}
