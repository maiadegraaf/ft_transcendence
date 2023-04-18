import { Module } from '@nestjs/common';
import { Server } from 'socket.io';
import { PongGateway } from './gateway/pong.gateway';
import { PongController } from './pong.controller';
import { PongService } from './pong.service';
import { UserModule } from '../user/user.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { MatchmakingService } from './matchmaking/matchmaking.service';
import { Matchmaking } from './matchmaking/matchmaking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchModule } from './match/match.module';
import { MatchService } from './match/match.service';
import { Match } from './match/match.entity';
import { MatchInstanceModule } from './match-instance/match-instance.module';
import { PracticeMatchModule } from './practice-match/practice-match.module';
import { PracticeMatchService } from './practice-match/practice-match.service';
import { PracticeMatchEntity } from './practice-match/practice-match.entity';
import { UserService } from '../user/services/user/user.service';
import { User } from '../user/user.entity';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { Leaderboard } from './leaderboard/leaderboard.entity';
import { LeaderboardService } from './leaderboard/leaderboard.service';
import { AvatarService } from 'src/user/services/user/avatar.service';
import { Avatar } from 'src/user/avatar.entity';

@Module({
    imports: [
        UserModule,
        MatchmakingModule,
        TypeOrmModule.forFeature([Matchmaking]),
        MatchModule,
        TypeOrmModule.forFeature([Match]),
        TypeOrmModule.forFeature([Avatar]),
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
        MatchmakingService,
        MatchService,
        PracticeMatchService,
        UserService,
        LeaderboardService,
        AvatarService,
    ],
})
export class PongModule {}
