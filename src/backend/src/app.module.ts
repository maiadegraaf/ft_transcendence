import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Match } from 'src/pong/match/match.entity';
// import { Avatar } from 'src/user/entities/avatar.entity';
import { Message } from './chat/entities/message.entity';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Match } from 'src/pong/entities/match.entity';
import { Channel } from './chat/entities/channel.entity';
import { ChatModule } from './chat/chat.module';
import { PongModule } from './pong/pong.module';
import { GroupProfile } from './chat/entities/groupProfile.entity';
import { MatchmakingModule } from './pong/matchmaking/matchmaking.module';
import { MatchModule } from './pong/match/match.module';
import { MatchInstanceModule } from './pong/match-instance/match-instance.module';
import { Matchmaking } from './pong/matchmaking/matchmaking.entity';
import { PracticeMatchEntity } from './pong/practice-match/practice-match.entity';
import { Leaderboard } from './pong/leaderboard/leaderboard.entity';
import { LeaderboardModule } from './pong/leaderboard/leaderboard.module';
import { TwoFAModule } from './auth/2fa/2fa.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'pongmaster',
            password: 'ping_pong42',
            database: 'transcendence',
            entities: [
                User,
                Match,
                Matchmaking,
                PracticeMatchEntity,
                Leaderboard,
                Message,
                Channel,
                GroupProfile,
            ],
            synchronize: true,
        }),
        MatchmakingModule,
        MatchModule,
        MatchInstanceModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', './frontend/dist'),
        }),
        UserModule,
        PongModule,
        ChatModule,
        AuthModule,
        LeaderboardModule,
    TwoFAModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
