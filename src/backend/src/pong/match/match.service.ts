import { Injectable } from '@nestjs/common';
import { Match } from 'src/pong/match/match.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {Not, Repository} from 'typeorm';
import { Player } from 'src/pong/player/player.entity';

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
    ) {}

    async createMatch(
        player1: Player,
        player2: Player,
    ): Promise<Match> {
        const match = new Match();
        match.player1 = player1;
        match.player2 = player2;
        console.log('match.player1: ', match.player1);
        console.log('match.player2: ', match.player2);
        match.score1 = 0;
        match.score2 = 0;
        try {
            const savedMatch = await this.matchRepository
                .createQueryBuilder()
                .insert()
                .into(Match)
                .values(match)
                .execute();
            return savedMatch.generatedMaps[0] as Match;
        } catch (e) {
            console.log(e);
            throw new Error('Could not create match');
        }
        // return this.matchRepository.save(match);
    }

    async getMatchById(id: number): Promise<Match> {
        return this.matchRepository.findOne({ where: { id } });
    }

    async returnPlayer1(match: Match): Promise<Player> {
        const tmp = await this.matchRepository.findOne({
            where: { id: match.id },
            relations: {
                player1: true,
            },
        });
        return tmp.player1;
    }

    async returnPlayer2(match: Match): Promise<Player> {
        const tmp = await this.matchRepository.findOne({
            where: { id: match.id },
            relations: {
                player2: true,
            },
        });
        return tmp.player2;
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
