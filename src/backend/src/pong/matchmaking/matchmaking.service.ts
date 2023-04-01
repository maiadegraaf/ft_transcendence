import { Injectable } from '@nestjs/common';
import { Matchmaking } from './matchmaking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from '../../users/entities/users.entity'

@Injectable()
export class MatchmakingService {
    constructor(
        @InjectRepository(Matchmaking)
        private readonly matchmakingRepository: Repository<Matchmaking>,
    ) {}

    async addPlayer(player: User): Promise<Matchmaking> {
        let matchmaking = await this.getMatchmakingByPlayer(player);
        if (!matchmaking) {
            matchmaking = new Matchmaking();
        }
        matchmaking.player = player;
        return await this.matchmakingRepository.save(matchmaking);
    }

    async getMatchmaking(): Promise<Matchmaking[]> {
        return this.matchmakingRepository.find({
            relations: {
                player: true,
            },
        });
    }

    async getMatchmakingById(id: number): Promise<Matchmaking> {
        return this.matchmakingRepository.findOne({ where: { id } });
    }

    async getMatchmakingByPlayer(player: User): Promise<Matchmaking> {
        return this.matchmakingRepository.findOne({ where: { player } });
    }

    async getMatchmakingBySocket(socketId: string): Promise<Matchmaking> {
        for (const matchmaking of await this.getMatchmaking()) {
            if (
                matchmaking.player &&
                matchmaking.player.socketId === socketId
            ) {
                return matchmaking;
            }
        }
        return null;
    }

    async remove(matchmaking: Matchmaking) {
        if (matchmaking) {
            await this.matchmakingRepository.remove(matchmaking);
        } else {
            console.log('Matchmaking not found');
        }
    }

    async removeBySocket(socketId: string) {
        const matchmaking = await this.getMatchmakingBySocket(socketId);
        if (matchmaking) {
            await this.matchmakingRepository.remove(matchmaking);
        } else {
            console.log('Matchmaking not found');
        }
    }

    async pop(): Promise<User> {
        const matchmaking = await this.matchmakingRepository.findOne({
            where: { id: Not(0) },
            relations: {
                player: true,
            },
        });
        if (!matchmaking) return null;
        await this.matchmakingRepository.remove(matchmaking);
        const player = matchmaking.player;
        return player;
    }

    async length(): Promise<number> {
        return await this.matchmakingRepository.count();
    }

    async push(matchmaking: Matchmaking) {
        await this.matchmakingRepository.save(matchmaking);
    }

    async print() {
        for (const matchmaking of await this.getMatchmaking()) {
            console.log(
                matchmaking,
            );
        }
    }
}
