import {
  ConsoleLogger,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { ResponseInterceptor } from './shared/Interceptors/response.interceptor';
import { CustomValidationPipe } from './shared/pipes/validation.pipe';
import { TemplatesService } from './templates/templates.service';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
      json: true,
    }),
  });
  const configService = app.get(ConfigService);
  const templatesService = app.get<TemplatesService>(TemplatesService);
  const port = configService.get<number>('PORT') ?? 101010101010;
  const host = configService.get<string>('common.ip') || '0.0.0.0';
  const customLogger = new Logger('main.ts');

  // file upload
  app.useStaticAssets(path.join(__dirname, '../uploads'));
  // Global Prefix
  app.setGlobalPrefix('api');

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Error & Response Interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Globall Validation Pipes
  app.useGlobalPipes(new CustomValidationPipe());

  // Global Guards
  // app.useGlobalGuards(new JwtGuard());

  //validating incoming requests bodies automitacally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that don't have decorators
      forbidNonWhitelisted: true,
      transform: true, // automatically transforms payloads to be objects typed according to their dto claases
      disableErrorMessages: false,
    }),
  );

  // Security
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.use(helmet());

  // Run the server
  const server = await app.listen(port, host, async () => {
    // Call the figlet-chalk banner here
    await templatesService.figletChalkTemplate();

    console.log(
      '\x1b[1m\x1b[31m%s\x1b[0m',
      `🚀 Server running at http://${host}:${port}/api`,
    );
    console.log(
      '\x1b[1m\x1b[33m%s\x1b[0m',
      `🚀 Socket running at http://${host}:${port}`,
    );

    customLogger.log(`Server running at http://${host}:${port}/api`);
  });

  return { app, server };
}
bootstrap();
