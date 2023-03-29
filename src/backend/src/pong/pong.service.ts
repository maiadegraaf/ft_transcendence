import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { User } from 'src/users/entities/users.entity';
import { Match } from 'src/pong/match/match.entity';
import { MatchInstance } from './match-instance/match-instance.service';
import { MatchmakingService } from './matchmaking/matchmaking.service';
import { MatchService } from './match/match.service';
import { PlayerService } from './player/player.service';
import { Player } from './player/player.entity';

const height = 450;
const width = 800;
const max_y = height - 15;
const min_y = 10;

enum Direction {
    Up = -1,
    Down = 1,
    Left = -1,
    Right = 1,
}

enum GameState {
    Start = 'start',
    Playing = 'playing',
    End = 'end',
}

interface Info {
    d: Direction;
    matchId: number;
}

interface Ball {
    x: number;
    y: number;
    dx: Direction;
    dy: Direction;
}

interface PlayerInterface {
    user: Player;
    socket: Socket;
    x: number;
    y: number;
    new_y: number;
    score: number;
}

@Injectable()
export class PongService {
    private logger: Logger = new Logger('PongGateway');
    private instances: { [key: number]: MatchInstance } = {};
    // private gamestate: GameState = GameState.Start;
    // private winner = '';
    private player2speed = 4;
    private practiceMode = false;
    // private winning_condition = 10;
    // private match: Match = null;
    // private ball: Ball = {
    //     x: width / 2,
    //     y: height / 2,
    //     dx: Direction.Left,
    //     dy: Direction.Up,
    // };
    // private player1: PlayerInterface = {
    //     socket: null,
    //     user: null,
    //     x: 20,
    //     y: height / 2 - 50,
    //     new_y: height / 2 - 50,
    //     score: 0,
    // };
    // private player2: PlayerInterface = {
    //     socket: null,
    //     user: null,
    //     x: width - 20,
    //     y: height / 2 - 50,
    //     new_y: height / 2 - 50,
    //     score: 0,
    // };

    constructor(
        private readonly server: Server,
        private matchmakingService: MatchmakingService,
        private matchesService: MatchService,
        private playerService: PlayerService,
    ) {}

    async handleConnection(client: Socket): Promise<void> {
        this.logger.log(`Client connected: ${client.id}`);
        const user = new User();
        await this.playerService.createPlayer(user, client.id);
        this.logger.log('player created for ' + client.id);
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
        const newPlayer = await this.playerService.getPlayerBySocket(client.id);
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
            let match = new Match();
            match = await this.matchesService.createMatch(player1, player2);
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
    }

    handleMove(client: Socket, data: Info): void {
        if (!data.matchId) {
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

    // handlePracticeMode(client: Socket, data: any): void {
    //     this.gamestate = GameState.Playing;
    //     this.practiceMode = true;
    //     this.winning_condition = data.score;
    //     this.player1.socket = client;
    //     switch (data.difficulty) {
    //         case 'easy':
    //             this.player2speed = 2;
    //             break;
    //         case 'normal':
    //             this.player2speed = 3;
    //             break;
    //         case 'hard':
    //             this.player2speed = 4.5;
    //             break;
    //         case 'impossible':
    //             this.player2speed = 5;
    //     }
    // }

    // handleMove(data: Info, client: Socket): void {
    //     if (!client) {
    //         console.log('no client');
    //         return;
    //     }
    //     console.log('SOCKET: ' + client.id + ' move: ' + data);
    //     if (
    //         this.practiceMode ||
    //         (this.gamestate == GameState.Playing &&
    //             client.id == this.player1.user.socketId)
    //     ) {
    //         this.player1.new_y += data.d * 100;
    //     } else if (
    //         this.gamestate == GameState.Playing &&
    //         client.id == this.player2.user.socketId
    //     ) {
    //         this.player2.new_y += data.d * 100;
    //     }
    // }
    //
    // emitToBothPlayers(event: string, data: any, client: Socket): void {
    //     if (this.practiceMode) {
    //         client.emit(event, data);
    //         return;
    //     }
    //     client.to(this.player1.user.socketId).emit(event, data);
    //     client.to(this.player2.user.socketId).emit(event, data);
    // }
    //
    // end(winner: string, client: Socket): void {
    //     this.gamestate = GameState.End;
    //     this.winner = winner;
    //     this.emitToBothPlayers(
    //         'state',
    //         {
    //             ball: this.ball,
    //             player1: this.player1,
    //             player2: this.player2,
    //             gamestate: this.gamestate,
    //             winner: this.winner,
    //         },
    //         client,
    //     );
    //     this.player1.score = 0;
    //     this.player2.score = 0;
    //     this.player1.y = height / 2 - 50;
    //     this.player2.y = height / 2 - 50;
    // }
    //
    // check_out_of_bounds(player): typeof player {
    //     if (player.y > max_y - 100) {
    //         player.y = max_y - 100;
    //         player.new_y = max_y - 100;
    //     } else if (player.y < min_y) {
    //         player.y = min_y;
    //         player.new_y = min_y;
    //     }
    //     return player;
    // }
    //
    // smooth_movement(player): typeof player {
    //     if (player.new_y < player.y) {
    //         player.y += -5;
    //     } else {
    //         player.y += 5;
    //     }
    //     player = this.check_out_of_bounds(player);
    //     return player;
    // }
    //
    // tick(client: Socket): void {
    //     if (this.gamestate !== GameState.Playing) {
    //         return;
    //     }
    //     if (this.player1.score >= this.winning_condition) {
    //         this.end('Player 1', client);
    //         return;
    //     } else if (this.player2.score >= this.winning_condition) {
    //         this.end('Player 2', client);
    //         return;
    //     }
    //
    //     this.ball.x += this.ball.dx * 5;
    //     this.ball.y += this.ball.dy * 5;
    //
    //     if (this.ball.x >= width / 2 && this.practiceMode == true) {
    //         this.player2.new_y = this.ball.y - 20;
    //         if (this.player2.y != this.player2.new_y) {
    //             if (this.player2.y > this.player2.new_y) {
    //                 this.player2.y += -this.player2speed;
    //             } else {
    //                 this.player2.y += this.player2speed;
    //             }
    //         }
    //         this.player2 = this.check_out_of_bounds(this.player2);
    //     }
    //
    //     if (this.player1.y != this.player1.new_y) {
    //         this.player1 = this.smooth_movement(this.player1);
    //     }
    //     if (
    //         this.player2.y != this.player2.new_y &&
    //         this.practiceMode == false
    //     ) {
    //         this.player2 = this.smooth_movement(this.player2);
    //     }
    //
    //     if (this.ball.y <= 0 || this.ball.y >= max_y - 10) {
    //         this.ball.dy *= -1;
    //     }
    //
    //     // check for collision with player 1
    //     if (
    //         this.ball.x <= 40 &&
    //         this.ball.y >= this.player1.y &&
    //         this.ball.y <= this.player1.y + 100
    //     ) {
    //         this.ball.dx *= -1;
    //     }
    //
    //     // check for collision with player 2
    //     if (
    //         this.ball.x >= width - 60 &&
    //         this.ball.y >= this.player2.y &&
    //         this.ball.y <= this.player2.y + 100
    //     ) {
    //         this.ball.dx *= -1;
    //     }
    //
    //     // check for scoring
    //     if (this.ball.x <= 35) {
    //         this.player2.score++;
    //         this.ball.x = width / 2;
    //         this.ball.y = height / 2;
    //         this.ball.dx = Direction.Left;
    //         this.ball.dy = Direction.Up;
    //     }
    //
    //     if (this.ball.x >= width - 38) {
    //         this.player1.score++;
    //         this.ball.x = width / 2;
    //         this.ball.y = height / 2;
    //         this.ball.dx = Direction.Right;
    //         this.ball.dy = Direction.Down;
    //     }
    //
    //     this.emitToBothPlayers(
    //         'state',
    //         {
    //             ball: this.ball,
    //             player1: this.player1,
    //             player2: this.player2,
    //             gamestate: this.gamestate,
    //             winner: this.winner,
    //         },
    //         client,
    //     );
    // }
}
