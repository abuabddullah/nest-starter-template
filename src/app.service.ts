import { Injectable } from '@nestjs/common';
import appConfig from './config/app.config';

type AppConfig = ReturnType<typeof appConfig>;

@Injectable()
export class AppService {
  private readonly config: AppConfig;

  constructor() {
    this.config = appConfig();
  }

  getHello(): string {
    return `Hello World! from ${this.config.common.appName}`;
  }
}
