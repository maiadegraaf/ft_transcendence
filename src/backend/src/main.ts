import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import * as session from 'express-session'
import { IoAdapter } from '@nestjs/platform-socket.io'

const sessionMiddleware = session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false
})

class ExpressSessionAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options)

        server.engine.use(sessionMiddleware)
        return server
    }
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api')
    app.use(sessionMiddleware)
    app.useWebSocketAdapter(new ExpressSessionAdapter(app))
    await app.init()

    await app.listen(8080)

    const logger: Logger = new Logger('BackendMain')
    logger.log('Application is running on: ' + (await app.getUrl()))
}
bootstrap().then()
