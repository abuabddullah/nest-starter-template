import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { IpThrottlerGuard } from './shared/guards/ip.throttler.guard';
import { JwtAuthGuard } from './shared/guards/jwt.guard';
import { RolesGuard } from './shared/guards/roles.guard';
import { TemplatesService } from './templates/templates.service';
import { UserModule } from './user/user.module';
import { UtilsService } from './utils/utils.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes configmodule globally available
      // validationSchema: joi.object({
      //   APP_NAME: Joi.string().default('defaultApp'),
      // }),
      envFilePath: '.env', // explicitly load .env
      load: [appConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    UserModule,
    AuthModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UtilsService,
    TemplatesService,
    JwtAuthGuard,
    RolesGuard,
    IpThrottlerGuard,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    await this.databaseService.createSuperAdmin();
  }
}
