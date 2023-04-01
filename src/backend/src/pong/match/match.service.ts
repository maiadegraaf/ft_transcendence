import { Injectable } from '@nestjs/common';
import { Match } from 'src/pong/match/match.entity';
import { User } from 'src/users/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
    ) {}

    async createMatch(
        player1: User,
        player2: User,
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

    async returnPlayer1(match: Match): Promise<User> {
        const tmp = await this.matchRepository.findOne({
            where: { id: match.id },
            relations: {
                player1: true,
            },
        });
        return tmp.player1;
    }

    async returnPlayer2(match: Match): Promise<User> {
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

    async print(match: Match) {
        const tmp = await this.matchRepository.findOne({
            where: { id: match.id },
            relations: {
                player1: true,
                player2: true,
            },
        });
        console.log('Current Match: ', tmp);
    }

    async updateScore(match: Match, score1: number, score2: number) {
        match.score1 = score1;
        match.score2 = score2;
        await this.matchRepository.save(match);
    }
}
