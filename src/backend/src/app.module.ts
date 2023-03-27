import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static'; // New
import { join } from 'path'; // New
import { ChatModule } from './chat/chat.module';
import { PongModule } from './pong/pong.module';
import { DatabaseModule } from './database/database.module';
import { MatchmakingModule } from "./pong/matchmaking/matchmaking.module";

@Module({
    imports: [
        DatabaseModule,
        ChatModule,
        PongModule,
        MatchmakingModule,
        ServeStaticModule.forRoot({
            // New
            rootPath: join(__dirname, '../..', '../frontend/dist'), // New
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
