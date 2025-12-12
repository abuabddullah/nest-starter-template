import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { TemplatesService } from 'src/templates/templates.service';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UtilsService, TemplatesService],
  exports: [
    UtilsService,
    TemplatesService,
    MongooseModule, // Export MongooseModule to make UserModel available
  ],
})
export class SharedModule {}
