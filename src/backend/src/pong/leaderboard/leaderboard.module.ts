import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { Leaderboard } from './leaderboard.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardController } from './leaderboard.controller';
import { Match } from '../match-instance/match';
import { PracticeMatchService } from '../practice-match/practice-match.service';
import { PracticeMatchEntity } from '../practice-match/practice-match.entity';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/services/user/user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Leaderboard]),
        TypeOrmModule.forFeature([PracticeMatchEntity]),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [LeaderboardService, Match, PracticeMatchService, UserService],
    controllers: [LeaderboardController],
})
export class LeaderboardModule {}
