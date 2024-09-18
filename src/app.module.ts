import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import configuration from 'config/index';
import { WinstonModule } from 'nest-winston';
import { ZodValidationPipe } from 'nestjs-zod';
import { UsersModule } from './components/users/users.module';
import { UserRepository } from './components/users/users.repository';
import { CustomResponseMiddleware } from './middleware/response';
import { PrismaModule } from './prisma/prisma.module';
import { winstonLogger } from './utils/winston-logger';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    UserRepository,
  ],
  imports: [
    PrismaModule,
    UsersModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    WinstonModule.forRoot({
      instance: winstonLogger,
      transports: winstonLogger.transports,
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CustomResponseMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
