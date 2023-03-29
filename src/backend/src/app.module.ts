import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Match } from 'src/pong/entities/match.entity';
// import { Avatar } from 'src/users/entities/avatar.entity';
import { User } from 'src/users/entities/users.entity';
import { Message } from './chat/entities/message.entity';
import { Channel } from './chat/entities/channel.entity';
import { UserModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { PongModule } from './pong/pong.module';
import { GroupProfile } from './chat/entities/groupProfile.entity';
import { MatchmakingModule } from './pong/matchmaking/matchmaking.module';
import { MatchModule } from './pong/match/match.module';
import { PlayerModule } from './pong/player/player.module';
import { MatchInstanceModule } from './pong/match-instance/match-instance.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
      port: 5432,
      username: 'pongmaster',
      password: 'ping_pong42',
      database: 'transcendence',
      entities: [User, Match, Message, Channel, GroupProfile],
      synchronize: true,
    }),
        MatchmakingModule,
        MatchModule,
        PlayerModule,
        MatchInstanceModule,
        ServeStaticModule.forRoot({

            rootPath: join(__dirname, '../..', '../frontend/dist'), }),
    UserModule,
    PongModule,
        ChatModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
