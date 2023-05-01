import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import * as session from 'express-session';
import * as fs from 'fs';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
    const server = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.setGlobalPrefix('api'); // New
    app.use(cookieParser()).use(
        session({
            secret: 'my-secret',
            resave: false,
            saveUninitialized: false,
        }),
    );
    await app.init();

    await app.listen(8080);
}
bootstrap();
