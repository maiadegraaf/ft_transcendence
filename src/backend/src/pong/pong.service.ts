import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { User } from 'src/user/user.entity';
import { Match } from './match-instance/match';
import { MatchInstance } from './match-instance/match-instance';
import { Info } from './interfaces/info.interface';
import { PracticeMatch } from './practice-match/practice-match';
import { PracticeMatchService } from './practice-match/practice-match.service';
import { UserService } from '../user/services/user/user.service';
import { LeaderboardService } from './leaderboard/leaderboard.service';
import { PracticeMatchEntity } from './practice-match/practice-match.entity';

@Injectable()
export class PongService {
    private logger: Logger = new Logger('PongGateway');
    private matchmakingList: User[] = [];
    private instances: { [key: number]: MatchInstance } = {};
    private practiceInstance: { [key: number]: PracticeMatch } = {};

    constructor(
        private readonly server: Server,
        private practiceMatchService: PracticeMatchService,
        private userService: UserService,
        private leaderboardService: LeaderboardService,
    ) {}

    async handleConnection(client: Socket, userId: any): Promise<void> {
        // this.logger.log('UserId sent by client: ' + userId);
        // this.logger.log(`Client connected: ${client.id}`);
        const user = await this.userService.findUserByID(userId);
        // if (!user) {
        //     this.logger.error('User not found');
        //     return;
        // }
        // if (await this.matchmakingService.getMatchmakingByPlayer(user)) {
        //     this.logger.log('User is already in matchmaking!');
        //     await this.matchmakingService.removeMatchmakingByPlayer(user);
        //     client.to(user.socketId).emit('matchmakingCanceled');
        // }
        // const instance = this.getInstanceByPlayerSocket(user.socketId);
        // if (instance) {
        //     instance.handlePlayerDisconnect(
        //         this.server.sockets.sockets.get(user.socketId),
        //     );
        // }
        // this.userService.addSocketIdToUser(user, client.id);
        this.logger.log('User connected: ' + user.login);
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
        const instance = this.getInstanceByPlayerSocket(client.id);
        if (instance) {
            instance.handlePlayerDisconnect(client);
            delete this.instances[instance.returnMatchId()];
        } else if (this.getMatchmakingBySocket(client.id)) {
            this.handleLeaveMatchmaking(client);
        } else {
            const practiceInstance = this.getPracticeInstanceByPlayerSocket(
                client.id,
            );
            if (practiceInstance) {
                practiceInstance.handleDisconnect(client);
                delete this.practiceInstance[
                    practiceInstance.returnPracticeMatchId()
                ];
            }
        }
        // turn off for now
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

    async addSocketIdToUser(userId: number, client: Socket): Promise<User> {
        const user = await this.userService.findUserByID(userId);
        if (!user) {
            this.logger.error('User not found');
            return null;
        }
        if (this.matchmakingList.find((u) => u.id == user.id)) {
            client.emit('matchmakingCanceled');
            return null;
        }
        const instance = this.getInstanceByPlayerSocket(user.socketId);
        if (instance) {
            instance.handlePlayerDisconnect(
                this.server.sockets.sockets.get(user.socketId),
            );
        }
        await this.userService.addSocketIdToUser(user, client.id);
        return user;
    }

    async handleJoinMatchmaking(client: Socket, userId: number): Promise<void> {
        this.logger.log(client.id + ' joined the waitlist');
        const newPlayer = await this.addSocketIdToUser(userId, client);
        if (!newPlayer) {
            return;
        }
        this.matchmakingList.push(newPlayer);
        if (this.matchmakingList.length > 1) {
            const player1 = this.matchmakingList.pop();
            const player2 = this.matchmakingList.pop();
            const match = new Match(player1, player2);
            this.instances[match.getId()] = new MatchInstance(
                this.server,
                match,
            );
            if (client.id == player1.socketId) {
                this.emitOpponentFound(client, player2.socketId, match.id);
            } else {
                this.emitOpponentFound(client, player1.socketId, match.id);
            }
            await this.instances[match.id].start();
        }
    }

    async handleLeaveMatchmaking(client: Socket): Promise<void> {
        this.logger.log(client.id + ' left the waitlist');
        this.matchmakingList.splice(
            this.matchmakingList.indexOf(
                this.getMatchmakingBySocket(client.id),
            ),
            1,
        );
    }

    checkForEndOfMatch(match: Match): void {
        if (match.score1 == 10 || match.score2 == 10) {
            this.leaderboardService.addMatchToLeaderboard(match);
            delete this.instances[match.id];
        }
    }

    checkForEndOfPracticeMatch(practiceMatch: PracticeMatchEntity): void {
        if (
            practiceMatch.score1 == practiceMatch.winningCondition ||
            practiceMatch.score2 == practiceMatch.winningCondition
        ) {
            this.leaderboardService.addPracticeMatchToLeaderboard(
                practiceMatch,
            );
            delete this.practiceInstance[practiceMatch.id];
        }
    }

    async tick(client: Socket): Promise<void> {
        for (const matchId in this.instances) {
            this.instances[matchId].tick(client);
            this.checkForEndOfMatch(this.instances[matchId].returnMatch());
        }
        for (const practiceMatchId in this.practiceInstance) {
            this.practiceInstance[practiceMatchId].tick(client);
            this.checkForEndOfPracticeMatch(
                await this.practiceMatchService.getPracticeMatchById(
                    parseInt(practiceMatchId, 10),
                ),
            );
        }
    }

    handleMove(client: Socket, data: Info): void {
        if (!data.matchId && !data.practiceMatchId) {
            return;
        }
        if (
            data.practiceMatchId &&
            this.practiceInstance[data.practiceMatchId]
        ) {
            this.practiceInstance[data.practiceMatchId].handleMove(
                client,
                data,
            );
            return;
        }
        if (!this.instances[data.matchId]) {
            return;
        }
        this.instances[data.matchId].handleMove(client, data);
    }

    getMatchmakingBySocket(socketId: string): User {
        for (const user of this.matchmakingList) {
            if (user.socketId == socketId) {
                return user;
            }
        }
        return null;
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
                this.practiceInstance[practiceMatchId].returnPlayerSocket() ==
                socketId
            ) {
                return this.practiceInstance[practiceMatchId];
            }
        }
        return null;
    }

    async handlePracticeMode(client: Socket, data: any) {
        const player = await this.addSocketIdToUser(data.userId, client);
        // const player = await this.userService.returnUserBySocketId(client.id);
        const practiceMatch =
            await this.practiceMatchService.createPracticeMatch(player);
        this.practiceInstance[practiceMatch.id] = new PracticeMatch(
            this.server,
            practiceMatch,
            this.practiceMatchService,
        );
        client.emit('practiceMatchCreated', practiceMatch.id, client.id);
        await this.practiceInstance[practiceMatch.id].start(data);
    }
}
