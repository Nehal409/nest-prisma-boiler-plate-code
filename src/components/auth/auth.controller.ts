import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { messages } from 'src/constants/messages';
import { AuthService } from './auth.service';
import { LoginRequestDto, RegisterRequestDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerBody: RegisterRequestDto) {
    const token = await this.authService.register(registerBody);
    return {
      data: token,
      message: messages.USER.REGISTERED_SUCCESSFULLY,
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

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    return { data: accessToken, message: messages.AUTH.ACCESS_TOKEN_SUCCESS };
  }
}
