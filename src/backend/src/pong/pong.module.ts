import { Module } from '@nestjs/common'
import { Server } from 'socket.io'
import { PongGateway } from './gateway/pong.gateway'
import { PongController } from './pong.controller'
import { PongService } from './pong.service'
import { UserModule } from '../user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Match } from './match/match'
import { MatchInstanceModule } from './match/match-instance.module'
import { PracticeMatchModule } from './practice-match/practice-match.module'
import { PracticeMatch } from './practice-match/practice-match'
import { UserService } from '../user/services/user/user.service'
import { User } from '../user/user.entity'
import { LeaderboardModule } from './leaderboard/leaderboard.module'
import { Leaderboard } from './leaderboard/leaderboard.entity'
import { LeaderboardService } from './leaderboard/leaderboard.service'
import { GameTools } from './game'
import { AvatarService } from 'src/user/services/user/avatar.service'
import { Avatar } from 'src/user/avatar.entity'
import { MatchService } from './match/match.service'
import { Matches } from './match/match.entity'

@Module({
    imports: [
        UserModule,
        MatchInstanceModule,
        PracticeMatchModule,
        TypeOrmModule.forFeature([User]),
        LeaderboardModule,
        TypeOrmModule.forFeature([Leaderboard]),
        TypeOrmModule.forFeature([Avatar]),
        TypeOrmModule.forFeature([Matches])
    ],
    controllers: [PongController],
    providers: [
        MatchService,
        GameTools,
        PongGateway,
        PongService,
        Server,
        Match,
        PracticeMatch,
        UserService,
        LeaderboardService,
        AvatarService
    ]
})
export class PongModule {}
