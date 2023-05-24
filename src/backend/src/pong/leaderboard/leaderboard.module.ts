import { Module } from '@nestjs/common'
import { LeaderboardService } from './leaderboard.service'
import { Leaderboard } from './leaderboard.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LeaderboardController } from './leaderboard.controller'
import { Match } from '../match/match'
import { PracticeMatch } from '../practice-match/practice-match'
import { User } from '../../user/user.entity'
import { UserService } from '../../user/services/user/user.service'
import { AvatarService } from 'src/user/services/user/avatar.service'
import { Avatar } from 'src/user/avatar.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([Leaderboard]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Avatar])
    ],
    providers: [LeaderboardService, Match, PracticeMatch, UserService, AvatarService],
    controllers: [LeaderboardController]
})
export class LeaderboardModule {}
