import { Module } from '@nestjs/common';
import { TemplatesService } from 'src/templates/templates.service';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  providers: [UtilsService, TemplatesService],
  exports: [UtilsService, TemplatesService], // Make sure to export it
})
export class SharedModule {}
