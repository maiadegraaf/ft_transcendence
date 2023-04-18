import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// import { Avatar } from 'src/user/entities/avatar.entity';
import { Message } from './chat/entities/message.entity';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Channel } from './chat/entities/channel.entity';
import { ChatModule } from './chat/chat.module';
import { PongModule } from './pong/pong.module';
import { GroupProfile } from './chat/entities/groupProfile.entity';
import { MatchInstanceModule } from './pong/match/match-instance.module';
import { Leaderboard } from './pong/leaderboard/leaderboard.entity';
import { LeaderboardModule } from './pong/leaderboard/leaderboard.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'pongmaster',
            password: 'ping_pong42',
            database: 'transcendence',
            entities: [User, Leaderboard, Message, Channel, GroupProfile],
            synchronize: true,
        }),
        MatchInstanceModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', './frontend/dist'),
        }),
        UserModule,
        PongModule,
        ChatModule,
        AuthModule,
        LeaderboardModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
