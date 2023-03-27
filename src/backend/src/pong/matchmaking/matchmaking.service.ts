import { Injectable } from '@nestjs/common';
import { Matchmaking } from './matchmaking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class MatchmakingService {
    constructor(
        @InjectRepository(Matchmaking)
        private readonly matchmakingRepository: Repository<Matchmaking>,
    ) {}

    async addPlayer(player: User, socketId: string): Promise<Matchmaking> {
        const matchmaking = new Matchmaking();
        matchmaking.player = player;
        matchmaking.socketId = socketId;
        return this.matchmakingRepository.save(matchmaking);
    }

    async getMatchmaking(): Promise<Matchmaking[]> {
        return this.matchmakingRepository.find();
    }

    async getMatchmakingById(id: number): Promise<Matchmaking> {
        return this.matchmakingRepository.findOne({ where: { id } });
    }

    async getMatchmakingBySocket(socketId: string): Promise<Matchmaking> {
        return this.matchmakingRepository.findOne({ where: { socketId } });
    }

    async remove(socketId: string) {
        const matchmaking = await this.getMatchmakingBySocket(socketId);
        if (matchmaking) {
            await this.matchmakingRepository.remove(matchmaking);
        } else {
            console.log('Matchmaking not found');
        }
    }

    async pop(): Promise<Matchmaking> {
        const matchmaking = await this.matchmakingRepository.findOne({
            where: { id: Not(0) },
        });
        if (!matchmaking) return null;
        await this.matchmakingRepository.remove(matchmaking);
        return matchmaking;
    }

    async length(): Promise<number> {
        return await this.matchmakingRepository.count();
    }

    async push(matchmaking: Matchmaking) {
        await this.matchmakingRepository.save(matchmaking);
    }

    async print() {
        const matchmaking = await this.getMatchmaking();
        console.log(matchmaking);
    }
}
