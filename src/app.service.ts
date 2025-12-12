import { Injectable } from '@nestjs/common';
import appConfig from './config/app.config';
import { TemplatesService } from './templates/templates.service';

type AppConfig = ReturnType<typeof appConfig>;

@Injectable()
export class AppService {
  private readonly config: AppConfig;

  constructor(private readonly templatesService: TemplatesService) {
    this.config = appConfig(); // call the function directly
  }

  getHello(): string {
    const serverHealthTemplate = this.templatesService.serverHealthTemplate();
    return serverHealthTemplate;
  }
}
