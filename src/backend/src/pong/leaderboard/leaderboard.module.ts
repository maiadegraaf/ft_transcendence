import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { Leaderboard } from './leaderboard.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardController } from './leaderboard.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Leaderboard])],
    providers: [LeaderboardService],
    controllers: [LeaderboardController],
})
export class LeaderboardModule {}
