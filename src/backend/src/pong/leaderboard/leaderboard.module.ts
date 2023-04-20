import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { Leaderboard } from './leaderboard.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardController } from './leaderboard.controller';
import { Match } from '../match/match';
import { PracticeMatch } from '../practice-match/practice-match';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/services/user/user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Leaderboard]),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [LeaderboardService, Match, PracticeMatch, UserService],
    controllers: [LeaderboardController],
})
export class LeaderboardModule {}
