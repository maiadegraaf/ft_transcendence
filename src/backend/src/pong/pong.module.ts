import { Module } from '@nestjs/common';
import { Server } from 'socket.io';
import { PongGateway } from './gateway/pong.gateway';
import { PongController } from './pong.controller';
import { PongService } from './pong.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match-instance/match';
import { MatchInstanceModule } from './match-instance/match-instance.module';
import { PracticeMatchModule } from './practice-match/practice-match.module';
import { PracticeMatchService } from './practice-match/practice-match.service';
import { PracticeMatchEntity } from './practice-match/practice-match.entity';
import { UserService } from '../user/services/user/user.service';
import { User } from '../user/user.entity';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { Leaderboard } from './leaderboard/leaderboard.entity';
import { LeaderboardService } from './leaderboard/leaderboard.service';

@Module({
    imports: [
        UserModule,
        MatchInstanceModule,
        PracticeMatchModule,
        TypeOrmModule.forFeature([PracticeMatchEntity]),
        TypeOrmModule.forFeature([User]),
        LeaderboardModule,
        TypeOrmModule.forFeature([Leaderboard]),
    ],
    controllers: [PongController],
    providers: [
        PongGateway,
        PongService,
        Server,
        Match,
        PracticeMatchService,
        UserService,
        LeaderboardService,
    ],
})
export class PongModule {}
