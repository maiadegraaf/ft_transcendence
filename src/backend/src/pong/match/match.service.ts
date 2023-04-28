import { Injectable } from '@nestjs/common';
import { User } from '../../user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PracticeMatch, Difficulty } from '../practice-match/practice-match';
import { Match } from './match';
import { Matches } from './match.entity';

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Matches) private MatchRepository: Repository<Matches>,
    ) {}

    async addMatch(match: Match) {
        const tmp = new Matches();
        tmp.player1 = match.player1;
        tmp.player2 = match.player2;
        tmp.player1Score = match.score1;
        tmp.player2Score = match.score2;
        return await this.MatchRepository.save(tmp);
    }

    async findMatches(): Promise<Matches[]> {
        return this.MatchRepository.find({
            select: ['player1Score', 'player2Score'],
            relations: {
                player1: true,
                player2: true,
            },
        });
    }

    async findMatchesByPlayer(player: User): Promise<Matches[]> {
        return this.MatchRepository.find({
            select: ['player1Score', 'player2Score'],
            relations: {
                player1: true,
                player2: true,
            },
            where: [{ player1: player }, { player2: player }],
        });
    }

    async findMatchesByPlayerAndOpponent(
        player: User,
        opponent: User,
    ): Promise<Matches[]> {
        return this.MatchRepository.find({
            select: ['player1Score', 'player2Score'],
            relations: {
                player1: true,
                player2: true,
            },
            where: [
                { player1: player, player2: opponent },
                { player1: opponent, player2: player },
            ],
        });
    }
}
