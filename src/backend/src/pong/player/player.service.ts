import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Player } from './player.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Match} from "../match/match.entity";

@Injectable()
export class PlayerService {
    constructor(
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
    ) {}

    async createPlayer(user: User, socketId: string): Promise<Player> {
        const player = new Player();
        player.player = user;
        player.socketId = socketId;
        const savedPlayer = await this.playerRepository
            .createQueryBuilder()
            .insert()
            .into(Player)
            .values(player)
            .execute();
        return savedPlayer.generatedMaps[0] as Player;
    }

    async getPlayerById(id: number): Promise<Player> {
        return this.playerRepository.findOne({ where: { id } });
    }

    async getPlayerBySocket(socketId: string): Promise<Player> {
        return this.playerRepository.findOne({ where: { socketId } });
    }

    async getPlayers(): Promise<Player[]> {
        return this.playerRepository.find();
    }

    async getPlayersByUser(user: User): Promise<Player[]> {
        return this.playerRepository.find({ where: { player: user } });
    }

    async addPlayer(player: Player) {
        await this.playerRepository.save(player);
    }

    async removePlayer(player: Player) {
        await this.playerRepository.remove(player);
    }

    async removePlayerBySocket(socketId: string) {
        const player = await this.getPlayerBySocket(socketId);
        if (player) {
            await this.playerRepository.remove(player);
        } else {
            console.log('Player not found');
        }
    }

    async removePlayerById(id: number) {
        const player = await this.getPlayerById(id);
        if (player) {
            await this.playerRepository.remove(player);
        } else {
            console.log('Player not found');
        }
    }

    async removePlayersByUser(user: User) {
        const players = await this.getPlayersByUser(user);
        for (const player of players) {
            await this.playerRepository.remove(player);
        }
    }

    async printPlayers() {
        const players = await this.getPlayers();
        console.log(players);
    }
}
