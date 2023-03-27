import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Match } from 'src/pong/entities/match.entity';
import { Matchmaking } from './matchmaking/matchmaking.entity';
import { MatchmakingService } from './matchmaking/matchmaking.service';
import { MatchService } from './match/match.service';

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

interface Ball {
    x: number;
    y: number;
    dx: Direction;
    dy: Direction;
}

interface Player {
    user: Matchmaking;
    socket: Socket;
    x: number;
    y: number;
    new_y: number;
    score: number;
}

@Injectable()
export class PongService {
    private logger: Logger = new Logger('PongGateway');
    private gamestate: GameState = GameState.Start;
    private winner = '';
    private player2speed = 4;
    private practiceMode = false;
    private winning_condition = 10;
    private match: Match = null;
    private ball: Ball = {
        x: width / 2,
        y: height / 2,
        dx: Direction.Left,
        dy: Direction.Up,
    };
    private player1: Player = {
        socket: null,
        user: null,
        x: 20,
        y: height / 2 - 50,
        new_y: height / 2 - 50,
        score: 0,
    };
    private player2: Player = {
        socket: null,
        user: null,
        x: width - 20,
        y: height / 2 - 50,
        new_y: height / 2 - 50,
        score: 0,
    };

    constructor(
        private readonly server: Server,
        private matchmakingService: MatchmakingService,
        private matchesService: MatchService,
    ) {}

    handleConnection(client: Socket): void {
        this.logger.log(`Client connected: ${client.id}`);
    }

    async handleJoinMatchmaking(client: Socket): Promise<void> {
        console.log(client.id + ' joined the waitlist');
        const newPlayer = new Matchmaking();
        newPlayer.socketId = client.id;
        // newPlayer.player = client.data.user;
        await this.matchmakingService.push(newPlayer);
        this.matchmakingService.print();
        const length = await this.matchmakingService.length();
        if (length > 1) {
            this.player2.user = await this.matchmakingService.pop();
            this.player1.user = await this.matchmakingService.pop();
            this.match = await this.matchesService.createMatch(
                this.player1.user,
                this.player2.user,
            );
            if (client.id == this.player1.user.socketId) {
                console.log('player1: ' + this.player1.user.socketId);
                client.emit('opponentFound', this.match.id);
                console.log('player2: ' + this.player2.user.socketId);
                client
                    .to(this.player2.user.socketId)
                    .emit('opponentFound', this.match.id);
            } else {
                console.log('player2: ' + this.player2.user.socketId);
                client.emit('opponentFound', this.match.id);
                console.log('player1: ' + this.player1.user.socketId);
                client
                    .to(this.player1.user.socketId)
                    .emit('opponentFound', this.match.id);
            }
            this.gamestate = GameState.Playing;
        }
    }

    handleLeaveMatchmaking(client: Socket): void {
        this.matchmakingService.remove(client.id);
    }

    handleStart(): void {
        this.gamestate = GameState.Playing;
    }

    handlePracticeMode(client: Socket, data: any): void {
        this.gamestate = GameState.Playing;
        this.practiceMode = true;
        this.winning_condition = data.score;
        this.player1.socket = client;
        switch (data.difficulty) {
            case 'easy':
                this.player2speed = 2;
                break;
            case 'normal':
                this.player2speed = 3;
                break;
            case 'hard':
                this.player2speed = 4.5;
                break;
            case 'impossible':
                this.player2speed = 5;
        }
    }

    handleMove(data: Direction, client: Socket): void {
        console.log('SOCKET: ' + client.id + ' move: ' + data);
        if (this.practiceMode) {
            this.player1.new_y += data * 100;
        } else if (
            this.gamestate == GameState.Playing &&
            client.id == this.player1.user.socketId
        ) {
            this.player1.new_y += data * 100;
        } else if (
            this.gamestate == GameState.Playing &&
            client.id == this.player2.user.socketId
        ) {
            this.player2.new_y += data * 100;
        }
    }

    emitToBothPlayers(event: string, data: any, client: Socket): void {
        if (this.practiceMode) {
            client.emit(event, data);
            return;
        }
        client.emit(event, data);
        client.emit(event, data);
    }

    end(winner: string, client: Socket): void {
        this.gamestate = GameState.End;
        this.winner = winner;
        this.emitToBothPlayers(
            'state',
            {
                ball: this.ball,
                player1: this.player1,
                player2: this.player2,
                gamestate: this.gamestate,
                winner: this.winner,
            },
            client,
        );
        this.player1.score = 0;
        this.player2.score = 0;
        this.player1.y = height / 2 - 50;
        this.player2.y = height / 2 - 50;
    }

    check_out_of_bounds(player): typeof player {
        if (player.y > max_y - 100) {
            player.y = max_y - 100;
            player.new_y = max_y - 100;
        } else if (player.y < min_y) {
            player.y = min_y;
            player.new_y = min_y;
        }
        return player;
    }

    smooth_movement(player): typeof player {
        if (player.new_y < player.y) {
            player.y += -5;
        } else {
            player.y += 5;
        }
        player = this.check_out_of_bounds(player);
        return player;
    }

    tick(client: Socket): void {
        if (this.gamestate !== GameState.Playing) {
            return;
        }
        if (this.player1.score >= this.winning_condition) {
            this.end('Player 1', client);
            return;
        } else if (this.player2.score >= this.winning_condition) {
            this.end('Player 2', client);
            return;
        }

        this.ball.x += this.ball.dx * 5;
        this.ball.y += this.ball.dy * 5;

        if (this.ball.x >= width / 2 && this.practiceMode == true) {
            this.player2.new_y = this.ball.y - 20;
            if (this.player2.y != this.player2.new_y) {
                if (this.player2.y > this.player2.new_y) {
                    this.player2.y += -this.player2speed;
                } else {
                    this.player2.y += this.player2speed;
                }
            }
            this.player2 = this.check_out_of_bounds(this.player2);
        }

        if (this.player1.y != this.player1.new_y) {
            this.player1 = this.smooth_movement(this.player1);
        }
        if (
            this.player2.y != this.player2.new_y &&
            this.practiceMode == false
        ) {
            this.player2 = this.smooth_movement(this.player2);
        }

        if (this.ball.y <= 0 || this.ball.y >= max_y - 10) {
            this.ball.dy *= -1;
        }

        // check for collision with player 1
        if (
            this.ball.x <= 40 &&
            this.ball.y >= this.player1.y &&
            this.ball.y <= this.player1.y + 100
        ) {
            this.ball.dx *= -1;
        }

        // check for collision with player 2
        if (
            this.ball.x >= width - 60 &&
            this.ball.y >= this.player2.y &&
            this.ball.y <= this.player2.y + 100
        ) {
            this.ball.dx *= -1;
        }

        // check for scoring
        if (this.ball.x <= 35) {
            this.player2.score++;
            this.ball.x = width / 2;
            this.ball.y = height / 2;
            this.ball.dx = Direction.Left;
            this.ball.dy = Direction.Up;
        }

        if (this.ball.x >= width - 38) {
            this.player1.score++;
            this.ball.x = width / 2;
            this.ball.y = height / 2;
            this.ball.dx = Direction.Right;
            this.ball.dy = Direction.Down;
        }

        this.emitToBothPlayers(
            'state',
            {
                ball: this.ball,
                player1: this.player1,
                player2: this.player2,
                gamestate: this.gamestate,
                winner: this.winner,
            },
            client,
        );
    }
}
