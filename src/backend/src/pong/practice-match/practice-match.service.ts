import { Injectable } from '@nestjs/common';
import { PracticeMatchEntity } from './practice-match.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Difficulty } from './practice-match.entity'
import { User } from '../../user/user.entity'

@Injectable()
export class PracticeMatchService {
    constructor(
        @InjectRepository(PracticeMatchEntity)
        private readonly practiceMatchRepository: Repository<PracticeMatchEntity>,
    ) {}

    async createPracticeMatch(
        user: User,
    ): Promise<PracticeMatchEntity> {
        const practiceMatch = new PracticeMatchEntity();
        practiceMatch.player = user;
        try {
            const savedPracticeMatch = await this.practiceMatchRepository
                .createQueryBuilder()
                .insert()
                .into(PracticeMatchEntity)
                .values(practiceMatch)
                .execute();
            return savedPracticeMatch.generatedMaps[0] as PracticeMatchEntity;
        } catch (e) {
            console.log(e);
            throw new Error('Could not create practice match');
        }
    }

    async getPracticeMatchById(id: number): Promise<PracticeMatchEntity> {
        return this.practiceMatchRepository.findOne({ where: { id } });
    }

    async returnPlayer(practiceMatch: PracticeMatchEntity): Promise<User> {
        const tmp = await this.practiceMatchRepository.findOne({
            where: { id: practiceMatch.id },
            relations: {
                player: true,
            },
        });
        return tmp.player;
    }

    async deletePracticeMatchById(id: number): Promise<void> {
        await this.practiceMatchRepository.delete({ id });
    }

    async deletePracticeMatchByPlayerId(playerId: number): Promise<void> {
        await this.practiceMatchRepository.delete({ player: { id: playerId } });
    }

    async deletePracticeMatchByPlayer(player: User): Promise<void> {
        await this.practiceMatchRepository.delete({ player });
    }

    async addPracticeMatch(practiceMatch: PracticeMatchEntity): Promise<void> {
        await this.practiceMatchRepository.save(practiceMatch);
    }

    async printPracticeMatch(practiceMatch: PracticeMatchEntity): Promise<void> {
        const tmp = await this.practiceMatchRepository.findOne({
            where: { id: practiceMatch.id },
            relations: {
                player: true,
            },
        });
        console.log('tmp: ', tmp);
    }

    async updateScore(practiceMatch: PracticeMatchEntity, score1: number, score2: number): Promise<void> {
        practiceMatch.score1 = score1;
        practiceMatch.score2 = score2;
        await this.practiceMatchRepository.save(practiceMatch);
    }

    async getPracticeMatches(): Promise<PracticeMatchEntity[]> {
        return this.practiceMatchRepository.find();
    }

    async getPracticeMatchBySocket(socketId: string): Promise<PracticeMatchEntity> {
        for (const practiceMatch of await this.getPracticeMatches()) {
            if (
                practiceMatch.player &&
                practiceMatch.player.socketId === socketId
            ) {
                return practiceMatch;
            }
        }
        return null;
    }

    async updateDifficulty(practiceMatch: PracticeMatchEntity, difficulty: Difficulty): Promise<void> {
        practiceMatch.difficulty = difficulty;
        await this.practiceMatchRepository.save(practiceMatch);
    }

    async updateWinningCondition(practiceMatch: PracticeMatchEntity, winningCondition: number): Promise<void> {
        practiceMatch.winningCondition = winningCondition;
        await this.practiceMatchRepository.save(practiceMatch);
    }
}
