import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { Leaderboard } from './leaderboard.entity';
import { UserService } from '../../user/services/user/user.service';
@Controller('leaderboard')
export class LeaderboardController {
    constructor(
        private readonly leaderboardService: LeaderboardService,
        private readonly userService: UserService,
    ) {}
    @Get()
    async findMatchResults(): Promise<Leaderboard[]> {
        return this.leaderboardService.findMatchResults();
    }

    @Get(':id')
    async findLeaderboardEntry(@Param('id') id: number): Promise<Leaderboard> {
        return this.leaderboardService.findLeaderboardEntry(
            await this.userService.findUserByID(id),
        );
    }
}
