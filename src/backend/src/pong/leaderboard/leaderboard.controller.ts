import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { Leaderboard } from './leaderboard.entity';
import { UserService } from '../../user/services/user/user.service';
import { FortyTwoAuthGuard } from '../../auth/auth.guard';
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

    @Get('id')
    @UseGuards(FortyTwoAuthGuard)
    async findLeaderboardEntry(@Req() req): Promise<Leaderboard> {
        const id = req.session.user.id;
        console.log('id: ', id);
        return this.leaderboardService.findLeaderboardEntry(
            await this.userService.findUserByID(id),
        );
    }
}
