import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { User } from 'src/user/user.entity';
import { Match } from './match/match';
import { MatchInstance } from './match/match-instance';
import { Info } from './interfaces/info.interface';
import { PracticeMatchInstance } from './practice-match/practice-match-instance';
import { Difficulty, PracticeMatch } from './practice-match/practice-match';
import { UserService } from '../user/services/user/user.service';
import { LeaderboardService } from './leaderboard/leaderboard.service';
import { PracticeMatchModule } from './practice-match/practice-match.module';

@Injectable()
export class PongService {
    private logger: Logger = new Logger('PongGateway');
    private matchmakingList: User[] = [];
    private instances: { [key: number]: MatchInstance } = {};
    private practiceInstance: { [key: number]: PracticeMatchInstance } = {};

    constructor(
        private readonly server: Server,
        private practiceMatchService: PracticeMatch,
        private userService: UserService,
        private leaderboardService: LeaderboardService,
    ) {}

    async handleConnection(client: Socket, userId: any): Promise<void> {
        // this.logger.log('UserId sent by client: ' + userId);
        // this.logger.log(`Client connected: ${client.id}`);
        // const user = await this.userService.findUserByID(userId);
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
        // await this.userService.addSocketIdToUser(user, client.id);
        this.logger.log('User connected: ' + userId);
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
        console.log('user found' + user);
        if (this.getMatchmakingByUserId(user.id)) {
            console.log('already in list');
            client.emit('already in list');
            return null;
        }
        if (this.getPracticeInstanceByUserId(user.id)) {
            console.log('already in practice match');
            client.emit('already in practice match');
            return null;
        }
        if (this.getInstanceByUserId(user.id)) {
            console.log('already in match');
            client.emit('already in match');
            return null;
        }
        // const instance = this.getInstanceByPlayerSocket(user.socketId);
        // if (instance) {
        //     instance.handlePlayerDisconnect(
        //         this.server.sockets.sockets.get(user.socketId),
        //     );
        // }
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
            this.instances[match.id] = new MatchInstance(this.server, match);
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

    checkForEndOfPracticeMatch(practiceMatch: PracticeMatch): void {
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
                this.practiceInstance[practiceMatchId].returnPracticeMatch(),
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

    getMatchmakingByUserId(userId: number): User {
        for (const user of this.matchmakingList) {
            if (user.id == userId) {
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

    getInstanceByUserId(userId: number): MatchInstance {
        for (const matchId in this.instances) {
            if (
                this.instances[matchId].returnPlayer(1).user.id == userId ||
                this.instances[matchId].returnPlayer(2).user.id == userId
            ) {
                return this.instances[matchId];
            }
        }
        return null;
    }

    getPracticeInstanceByPlayerSocket(socketId: string): PracticeMatchInstance {
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

    getPracticeInstanceByUserId(userId: number): PracticeMatchInstance {
        for (const practiceMatchId in this.practiceInstance) {
            if (
                this.practiceInstance[practiceMatchId].returnPlayer().user.id ==
                userId
            ) {
                return this.practiceInstance[practiceMatchId];
            }
        }
        return null;
    }

    async handlePracticeMode(client: Socket, data: any) {
        const player = await this.addSocketIdToUser(data.userId, client);
        if (!player) {
            return;
        }
        const practiceMatch = new PracticeMatch(
            player,
            data.selectedDifficulty,
            data.score,
        );
        this.practiceInstance[practiceMatch.id] = new PracticeMatchInstance(
            this.server,
            practiceMatch,
            this.practiceMatchService,
        );
        client.emit('practiceMatchCreated', practiceMatch.id, client.id);
        await this.practiceInstance[practiceMatch.id].start(data);
    }
}
