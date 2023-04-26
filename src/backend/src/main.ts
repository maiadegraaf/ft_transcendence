import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import * as session from 'express-session';
import * as fs from 'fs';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as https from 'https';
import * as http from 'http';
import * as passport from 'passport';
import { IoAdapter } from '@nestjs/platform-socket.io';

const sessionMiddleware = session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
});

class ExpressSessionAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);

        server.engine.use(sessionMiddleware);
        return server;
    }
}

async function bootstrap() {
    // const httpsOptions = {
    //     key: fs.readFileSync('./secrets/private-key.pem', 'utf-8'),
    //     cert: fs.readFileSync('./secrets/public-certificate.pem', 'utf-8'),
    // };
    // const server = express();

    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api'); // New
    app.use(sessionMiddleware);
    app.useWebSocketAdapter(new ExpressSessionAdapter(app));
    await app.init();
    await app.listen(8080);

    const logger: Logger = new Logger('BackendMain');
    logger.log('Application is running on: ' + (await app.getUrl()));
}
bootstrap().then();
