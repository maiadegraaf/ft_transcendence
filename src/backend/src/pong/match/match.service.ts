import { Injectable } from '@nestjs/common';
import { Match } from 'src/pong/entities/match.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matchmaking } from 'src/pong/matchmaking/matchmaking.entity';

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
    ) {}

    async createMatch(
        player1: Matchmaking,
        player2: Matchmaking,
    ): Promise<Match> {
        const match = new Match();
        match.player1 = player1;
        match.player2 = player2;
        match.score1 = 0;
        match.score2 = 0;
        return this.matchRepository.save(match);
    }

    async getMatchById(id: number): Promise<Match> {
        return this.matchRepository.findOne({ where: { id } });
    }

    async getMatches(): Promise<Match[]> {
        return this.matchRepository.find();
    }

    async getMatchesByPlayer(player: User): Promise<Match[]> {
        return this.matchRepository.find({
            where: [{ player1: player }, { player2: player }],
        });
    }

    async addMatch(match: Match) {
        await this.matchRepository.save(match);
    }
}
