import { Injectable } from '@nestjs/common';
import { Matchmaking } from './matchmaking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../player/player.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class MatchmakingService {
    constructor(
        @InjectRepository(Matchmaking)
        private readonly matchmakingRepository: Repository<Matchmaking>,
    ) {}

    async addPlayer(player: Player): Promise<Matchmaking> {
        let matchmaking = await this.getMatchmakingByPlayer(player);
        if (!matchmaking) {
            matchmaking = new Matchmaking();
        }
        matchmaking.player = player;
        console.log(matchmaking);
        return await this.matchmakingRepository.save(matchmaking);
    }

    async getMatchmaking(): Promise<Matchmaking[]> {
        return this.matchmakingRepository.find();
    }

    async getMatchmakingById(id: number): Promise<Matchmaking> {
        return this.matchmakingRepository.findOne({ where: { id } });
    }

    async getMatchmakingByPlayer(player: Player): Promise<Matchmaking> {
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

    async pop(): Promise<Player> {
        const matchmaking = await this.matchmakingRepository.findOne({
            where: { id: Not(0) },
        });
        console.log('pop');
        await this.print();
        if (!matchmaking) return null;
        await this.matchmakingRepository.remove(matchmaking);
        const player = matchmaking.player;
        console.log(matchmaking + ' removed');
        console.log(player + ' returned');
        return player;
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
