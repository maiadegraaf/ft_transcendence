import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { User } from 'src/users/entities/users.entity';
import { MatchInstance } from './match-instance/match-instance';
import { MatchmakingService } from './matchmaking/matchmaking.service';
import { MatchService } from './match/match.service';
import { Info } from './interfaces/info.interface';
import { PracticeMatch } from './practice-match/practice-match'
import { PracticeMatchService } from './practice-match/practice-match.service'
import { UsersService } from '../users/services/users/users.service'

@Injectable()
export class PongService {
    private logger: Logger = new Logger('PongGateway');
    private instances: { [key: number]: MatchInstance } = {};
    private practiceInstance: { [key: number]: PracticeMatch } = {};

    constructor(
        private readonly server: Server,
        private matchmakingService: MatchmakingService,
        private matchesService: MatchService,
        private practiceMatchService: PracticeMatchService,
        private userService: UsersService,
    ) {}

    async handleConnection(client: Socket): Promise<void> {
        this.logger.log(`Client connected: ${client.id}`);
        const user = new User();
        user.socketId = client.id;
        this.logger.log('SocketId added to User: [${client.id}]');
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
        const instance = this.getInstanceByPlayerSocket(client.id);
        if (instance) {
            instance.handlePlayerDisconnect(client);
            delete this.instances[instance.returnMatchId()];
        } else if (this.matchmakingService.getMatchmakingBySocket(client.id)) {
            this.handleLeaveMatchmaking(client);
            if (!this.matchmakingService.getMatchmakingBySocket(client.id)) {
                console.log('player removed from matchmaking for ' + client.id);
            }
        } else {
            const practiceInstance = this.getPracticeInstanceByPlayerSocket(client.id);
            if (practiceInstance) {
                practiceInstance.handleDisconnect(client);
                delete this.practiceInstance[practiceInstance.returnPracticeMatchId()];
            }
        }
        // this.playerService.removePlayerBySocket(client.id);
        // if (!this.playerService.getPlayerBySocket(client.id)) {
        //     console.log('player removed for ' + client.id);
        // }
    }

    emitOpponentFound(
        client: Socket,
        opponentSocketId: string,
        matchId: number,
    ): void {
        client.emit('opponentFound', matchId);
        client.to(opponentSocketId).emit('opponentFound', matchId);
    }

    async handleJoinMatchmaking(client: Socket): Promise<void> {
        this.logger.log(client.id + ' joined the waitlist');
        const newPlayer = await this.userService.returnUserBySocketId(client.id);
        await this.matchmakingService.addPlayer(newPlayer);
        // console.log(newPlayer + ' added to matchmaking');
        // this.logger.log(
        //     'This is the current matchmaking list: ' +
        //         (await this.matchmakingService.print()),
        // );
        const length = await this.matchmakingService.length();
        if (length > 1) {
            const player1 = await this.matchmakingService.pop();
            const player2 = await this.matchmakingService.pop();
            let match = await this.matchesService.createMatch(player1, player2);
            this.logger.log(
                'player1 socket: ' + player1.socketId + ' id: ' + player1.id,
            );
            this.logger.log(
                'player2 socket: ' + player2.socketId + ' id: ' + player2.id,
            );
            this.instances[match.id] = new MatchInstance(
                this.server,
                match,
                this.matchesService,
            );
            if (client.id == player1.socketId) {
                this.emitOpponentFound(client, player2.socketId, match.id);
            } else {
                this.emitOpponentFound(client, player1.socketId, match.id);
            }
            await this.instances[match.id].start();
            console.log('match started: ' + match.id);
        }
    }

    async handleLeaveMatchmaking(client: Socket): Promise<void> {
        this.logger.log(client.id + ' left the waitlist');
        await this.matchmakingService.removeBySocket(client.id);
    }

    tick(client: Socket): void {
        for (const matchId in this.instances) {
            this.instances[matchId].tick(client);
        }
        for (const practiceMatchId in this.practiceInstance) {
            this.practiceInstance[practiceMatchId].tick(client);
        }
    }

    handleMove(client: Socket, data: Info): void {
        if (!data.matchId && !data.practiceMatchId) {
            return;
        }
        if (data.practiceMatchId) {
            this.practiceInstance[data.practiceMatchId].handleMove(client, data);
            return;
        }
        this.instances[data.matchId].handleMove(client, data);

    }

    getInstanceByPlayerSocket(socketId: string): MatchInstance {
        for (const matchId in this.instances) {
            if (
                this.instances[matchId].returnPlayerSocket(1) == socketId ||
                this.instances[matchId].returnPlayerSocket(2) == socketId
            ) {
                return this.instances[matchId];
            }
        }
        return null;
    }

    getPracticeInstanceByPlayerSocket(socketId: string): PracticeMatch {
        for (const practiceMatchId in this.practiceInstance) {
            if (
                this.practiceInstance[practiceMatchId].returnPlayerSocket() == socketId
            ) {
                return this.practiceInstance[practiceMatchId];
            }
        }
        return null;
    }

    async handlePracticeMode(client: Socket, data: any) {
        const player = await this.userService.returnUserBySocketId(client.id);
        const practiceMatch = await this.practiceMatchService.createPracticeMatch(player);
        this.practiceInstance[practiceMatch.id] = new PracticeMatch(this.server, practiceMatch, this.practiceMatchService);
        client.emit('practiceMatchCreated', practiceMatch.id);
        await this.practiceInstance[practiceMatch.id].start(data);
    }
}
