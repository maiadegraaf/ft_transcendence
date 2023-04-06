import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { Leaderboard } from './leaderboard.entity';
@Controller('leaderboard')
export class LeaderboardController {
    constructor(private readonly leaderboardService: LeaderboardService) {}
    @Get()
    async findAll(): Promise<Leaderboard[]> {
        return this.leaderboardService.findAll();
    }
}
