import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { SharedModule } from 'src/shared/module/shared.module';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          let destination: string;
          const fieldName = file.fieldname.toLowerCase();

          if (fieldName.includes('video')) {
            destination = './uploads/videos';
          } else if (
            fieldName.includes('couverture') ||
            fieldName.includes('avatar') ||
            fieldName.includes('image')
          ) {
            destination = './uploads/images';
          } else if (fieldName.includes('document')) {
            destination = './uploads/documents';
          } else {
            destination = './uploads/others';
          }

          cb(null, destination);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
    SharedModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
