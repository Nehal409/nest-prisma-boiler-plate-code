import { unauthorized } from '@hapi/boom';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from 'src/components/users/users.repository';
import { messages } from 'src/constants/messages';
import { AccessTokenPayload } from '../types/AccessTokenPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: AccessTokenPayload) {
    const user = await this.usersRepository.getUserDetails(payload.id);

    if (!user) {
      throw unauthorized(messages.USER.NOT_FOUND);
    }

    return {
      userId: payload.id,
    };
  }
}
