import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { Leaderboard } from './leaderboard.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardController } from './leaderboard.controller';
import { MatchService } from '../match/match.service';
import { Match } from '../match/match.entity';
import { PracticeMatchService } from '../practice-match/practice-match.service';
import { PracticeMatchEntity } from '../practice-match/practice-match.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Leaderboard]),
        TypeOrmModule.forFeature([Match]),
        TypeOrmModule.forFeature([PracticeMatchEntity]),
    ],
    providers: [LeaderboardService, MatchService, PracticeMatchService],
    controllers: [LeaderboardController],
})
export class LeaderboardModule {}
