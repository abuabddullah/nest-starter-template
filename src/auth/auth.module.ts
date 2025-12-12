// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';

// @Module({
//   controllers: [AuthController],
//   providers: [AuthService],
// })
// export class AuthModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthMiddleware } from './auth.middleware';
import { UserModule } from '../user/user.module';
import { UtilsService } from 'src/utils/utils.service';
import { TemplatesService } from 'src/templates/templates.service';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    UserModule,
    WebSocketModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AuthService,
    UtilsService,
    TemplatesService,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/change-password');
  }
}
