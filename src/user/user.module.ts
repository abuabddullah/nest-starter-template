import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/module/shared.module';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    SharedModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UserService,
  ],
})
export class UserModule {}
