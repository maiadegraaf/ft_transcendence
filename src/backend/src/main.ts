import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { WsAdapter } from '@nestjs/platform-ws';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api'); // New
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(8080);
    const logger: Logger = new Logger('BackendMain');
  logger.log('Application is running on: ' + (await app.getUrl()));
}
bootstrap();
