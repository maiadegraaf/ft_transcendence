import { Injectable, Logger } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { User } from 'src/user/user.entity'
import { Match } from './match/match'
import { MatchInstance } from './match/match-instance'
import { Info } from './interfaces/info.interface'
import { PracticeMatchInstance } from './practice-match/practice-match-instance'
import { PracticeMatch } from './practice-match/practice-match'
import { UserService } from '../user/services/user/user.service'
import { LeaderboardService } from './leaderboard/leaderboard.service'
import { MatchService } from './match/match.service'

@Injectable()
export class PongService {
    private logger: Logger = new Logger('PongGateway')
    private matchmakingList: User[] = []
    private matchmakingOneVOneList: User[] = []
    private instances: { [key: number]: MatchInstance } = {}
    private practiceInstance: { [key: number]: PracticeMatchInstance } = {}

    constructor(
        private readonly server: Server,
        private practiceMatchService: PracticeMatch,
        private userService: UserService,
        private leaderboardService: LeaderboardService,
        private matchService: MatchService
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
        this.logger.log('User connected to pong: ' + userId)
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`)
        const m = this.getMatchmakingBySocket(client.id)
        if (m) {
            this.matchmakingList.splice(this.matchmakingList.indexOf(m), 1)
        }
        const i = this.getInstanceByPlayerSocket(client.id)
        if (i) {
            i.handlePlayerDisconnect(client)
        }
        const p = this.getPracticeInstanceByPlayerSocket(client.id)
        if (p) {
            p.handleDisconnect(client)
        }
    }

    emitOpponentFound(client: Socket, opponentSocketId: string, matchId: number): void {
        client.emit('opponentFound', matchId)
        client.to(opponentSocketId).emit('opponentFound', matchId)
    }

    async addSocketIdToUser(userId: number, client: Socket): Promise<User> {
        const user = await this.userService.findUserByID(userId)
        if (!user) {
            this.logger.error('User not found')
            return null
        }
        if (this.getMatchmakingByUserId(user.id)) {
            client.emit('MultipleConnections', 'waiting to join a match')
            return null
        }
        if (this.getPracticeInstanceByUserId(user.id)) {
            client.emit('MultipleConnections', 'in a practice match')
            return null
        }
        if (this.getInstanceByUserId(user.id)) {
            console.log('already in match')
            client.emit('MultipleConnections', 'in a match')
            return null
        }
        await this.userService.addSocketIdToUser(user, client.id)
        return user
    }

    async handleJoinMatchmaking(client: Socket, userId: number): Promise<void> {
        this.logger.log(client.id + ' joined the waitlist')
        const newPlayer = await this.addSocketIdToUser(userId, client)
        if (!newPlayer) {
            return
        }
        this.matchmakingList.push(newPlayer)
        if (this.matchmakingList.length > 1) {
            await this.createMatch(client, this.matchmakingList.pop(), this.matchmakingList.pop())
        }
    }

    async handleJoinMatchmakingOneVOne(
        client: Socket,
        userId: number,
        opponentId: number,
        senderId: number
    ): Promise<void> {
        if (userId === opponentId || userId === senderId) {
            this.logger.log(client.id + ' joined the waitlist')
            const newPlayer = await this.addSocketIdToUser(userId, client)
            if (!newPlayer) {
                return
            }
            console.log('new player' + newPlayer)
            this.matchmakingOneVOneList.push(newPlayer)
            if (this.matchmakingOneVOneList.length > 1) {
                await this.createMatch(
                    client,
                    this.matchmakingOneVOneList.pop(),
                    this.matchmakingOneVOneList.pop()
                )
            }
        }
    }

    async handleCreateMatch(client: Socket, player1Id: number, player2Id: number) {
        const player1 = await this.userService.findUserByID(player1Id)
        const player2 = await this.userService.findUserByID(player2Id)
        console.log('player1' + player1.socketId)
        console.log('player2' + player2.socketId)
        if (!player1 || !player2) {
            return
        }
        await this.createMatch(client, player1, player2)
    }

    async createMatch(client: Socket, player1: User, player2: User): Promise<Match> {
        const matchId = await this.matchService.getNextMatchId()
        const match = new Match(player1, player2, matchId)
        this.instances[match.id] = new MatchInstance(match)
        this.instances[match.id].start()
        if (client.id == player1.socketId) {
            this.emitOpponentFound(client, player2.socketId, match.id)
        } else {
            this.emitOpponentFound(client, player1.socketId, match.id)
        }
        return match
    }

    async handleLeaveMatchmaking(client: Socket): Promise<void> {
        this.logger.log(client.id + ' left the waitlist')
        this.matchmakingList.splice(
            this.matchmakingList.indexOf(this.getMatchmakingBySocket(client.id)),
            1
        )
    }

    async handleLeaveMatchmakingOneVOne(client: Socket): Promise<void> {
        this.logger.log(client.id + ' left the waitlist')
        this.matchmakingOneVOneList.splice(
            this.matchmakingOneVOneList.indexOf(this.getMatchmakingBySocket(client.id)),
            1
        )
    }

    checkForEndOfMatch(match: Match): void {
        if (match.score1 == 10 || match.score2 == 10) {
            this.leaderboardService.addMatchToLeaderboard(match)
            this.matchService.addMatch(match)
            delete this.instances[match.id]
        }
    }

    checkForEndOfPracticeMatch(practiceMatch: PracticeMatch): void {
        if (
            practiceMatch.score1 == practiceMatch.winningCondition ||
            practiceMatch.score2 == practiceMatch.winningCondition
        ) {
            this.leaderboardService.addPracticeMatchToLeaderboard(practiceMatch)
            delete this.practiceInstance[practiceMatch.id]
        }
    }

    async tick(client: Socket): Promise<void> {
        for (const matchId in this.instances) {
            this.instances[matchId].tick(client)
            this.checkForEndOfMatch(this.instances[matchId].returnMatch())
        }
        for (const practiceMatchId in this.practiceInstance) {
            this.practiceInstance[practiceMatchId].tick(client)
            this.checkForEndOfPracticeMatch(
                this.practiceInstance[practiceMatchId].returnPracticeMatch()
            )
        }
    }

    handleMove(client: Socket, data: Info): void {
        if (!data.matchId && !data.practiceMatchId) {
            return
        }
        if (data.practiceMatchId && this.practiceInstance[data.practiceMatchId]) {
            this.practiceInstance[data.practiceMatchId].handleMove(client, data)
            return
        }
        if (!this.instances[data.matchId]) {
            return
        }
        this.instances[data.matchId].handleMove(client, data)
    }

    getMatchmakingBySocket(socketId: string): User {
        for (const user of this.matchmakingList) {
            if (user.socketId == socketId) {
                return user
            }
        }
        return null
    }

    getMatchmakingByUserId(userId: number): User {
        for (const user of this.matchmakingList) {
            if (user.id == userId) {
                return user
            }
        }
        return null
    }

    getInstanceByPlayerSocket(socketId: string): MatchInstance {
        for (const matchId in this.instances) {
            if (
                this.instances[matchId].returnPlayerSocket(1) == socketId ||
                this.instances[matchId].returnPlayerSocket(2) == socketId
            ) {
                return this.instances[matchId]
            }
        }
        return null
    }

    getInstanceByUserId(userId: number): MatchInstance {
        for (const matchId in this.instances) {
            if (
                this.instances[matchId].returnPlayer(1).user.id == userId ||
                this.instances[matchId].returnPlayer(2).user.id == userId
            ) {
                return this.instances[matchId]
            }
        }
        return null
    }

    getPracticeInstanceByPlayerSocket(socketId: string): PracticeMatchInstance {
        for (const practiceMatchId in this.practiceInstance) {
            if (this.practiceInstance[practiceMatchId].returnPlayerSocket() == socketId) {
                return this.practiceInstance[practiceMatchId]
            }
        }
        return null
    }

    getPracticeInstanceByUserId(userId: number): PracticeMatchInstance {
        for (const practiceMatchId in this.practiceInstance) {
            if (this.practiceInstance[practiceMatchId].returnPlayer().user.id == userId) {
                return this.practiceInstance[practiceMatchId]
            }
        }
        return null
    }

    async handlePracticeMode(client: Socket, data: any) {
        if (!data.userId) {
            this.logger.log('no user id')
        }
        this.logger.log(data.userId + ' joined practice mode')
        const player = await this.addSocketIdToUser(data.userId, client)
        this.logger.log('practice mode')
        if (!player) {
            return
        }
        const practiceMatch = new PracticeMatch(player, data.selectedDifficulty, data.score)
        this.practiceInstance[practiceMatch.id] = new PracticeMatchInstance(
            this.server,
            practiceMatch
        )
        client.emit('practiceMatchCreated', practiceMatch.id, client.id)
        await this.practiceInstance[practiceMatch.id].start(data)
    }
}
