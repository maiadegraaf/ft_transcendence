import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // New
  app.use(cookieParser());
  await app.listen(8080);
  console.log('Application is running on: ' + (await app.getUrl()));
}
bootstrap();
