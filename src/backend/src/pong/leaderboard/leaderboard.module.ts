import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { Leaderboard } from './leaderboard.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardController } from './leaderboard.controller';
import { MatchService } from '../match/match.service';
import { Match } from '../match/match.entity';
import { PracticeMatchService } from '../practice-match/practice-match.service';
import { PracticeMatchEntity } from '../practice-match/practice-match.entity';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/services/user/user.service';
import { AvatarService } from 'src/user/services/user/avatar.service';
import { Avatar } from 'src/user/avatar.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Leaderboard]),
        TypeOrmModule.forFeature([Match]),
        TypeOrmModule.forFeature([PracticeMatchEntity]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Avatar]),
    ],
    providers: [
        LeaderboardService,
        MatchService,
        PracticeMatchService,
        UserService,
        AvatarService,
    ],
    controllers: [LeaderboardController],
})
export class LeaderboardModule {}
