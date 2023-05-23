import { Controller, Get, Req } from '@nestjs/common'
import { MatchService } from './match.service'
import { Matches } from './match.entity'
import { UserService } from '../../user/services/user/user.service'
import { User } from '../../user/user.entity'

@Controller('match')
export class MatchController {
    constructor(
        private readonly matchService: MatchService,
        private readonly userService: UserService
    ) {}

    @Get()
    async findMatchesByUser(@Req() req): Promise<Matches[]> {
        const user = req.session.user
        return this.matchService.findMatchesByPlayer(user)
    }
    @Get(':id')
    async findMatchesByUserId(@Req() req): Promise<Matches[]> {
        const user = await this.userService.findUserByID(req.params.id)
        return this.matchService.findMatchesByPlayer(user)
    }

    @Get('all')
    async findMatches(): Promise<Matches[]> {
        return this.matchService.findMatches()
    }

    @Get('versus:id')
    async findMatchesByPlayerAndOpponent(@Req() req): Promise<Matches[]> {
        const user = req.session.user
        const opponent = await this.userService.findUserByID(req.params.id)
        return this.matchService.findMatchesByPlayerAndOpponent(user, opponent)
    }
}
