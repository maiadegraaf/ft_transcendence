import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // New
  app.use(cookieParser());
  await app.listen(8080);

  const logger: Logger = new Logger('BackendMain');
  logger.log('Application is running on: ' + (await app.getUrl()));
}
bootstrap();
