import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Match } from './match';
import { Direction, GameState } from '../enums';
import { Ball } from '../interfaces/ball.interface';
import { Player } from '../interfaces/player.interface';
import { Info } from '../interfaces/info.interface';

const height = 450;
const width = 800;
const max_y = height - 15;
const min_y = 10;
const winning_condition = 10;

@Injectable()
export class MatchInstance {
    private logger: Logger = new Logger('PongGateway');
    private gamestate: GameState = GameState.Start;
    private winner = '';
    private readonly match: Match;
    private server: Server;
    private ball: Ball = {
        x: width / 2,
        y: height / 2,
        dx: Direction.Left,
        dy: Direction.Up,
    };
    private player1: Player = {
        user: null,
        x: 20,
        y: height / 2 - 50,
        new_y: height / 2 - 50,
        score: 0,
    };
    private player2: Player = {
        user: null,
        x: width - 20,
        y: height / 2 - 50,
        new_y: height / 2 - 50,
        score: 0,
    };

    constructor(server: Server, match: Match) {
        this.server = server;
        this.match = match;
    }

    async start(): Promise<void> {
        this.gamestate = GameState.Playing;
        this.player1.user = this.match.getPlayer1();
        this.player2.user = this.match.getPlayer2();
    }

    handlePlayerDisconnect(client: Socket): void {
        if (client.id == this.player1.user.socketId) {
            this.player2.score = 10;
            this.end('Player 2', client);
        } else if (client.id == this.player2.user.socketId) {
            this.player1.score = 10;
            this.end('Player 1', client);
        }
    }

    returnPlayerSocket(player: number) {
        if (player == 1) {
            return this.player1.user.socketId;
        } else if (player == 2) {
            return this.player2.user.socketId;
        }
    }

    returnMatchId() {
        return this.match.id;
    }

    returnMatch() {
        return this.match;
    }

    handleMove(client: Socket, data: Info): void {
        if (!client) {
            console.log('no client');
            return;
        }
        if (
            this.gamestate == GameState.Playing &&
            client.id == this.player1.user.socketId
        ) {
            this.player1.new_y += data.d * 100;
        } else if (
            this.gamestate == GameState.Playing &&
            client.id == this.player2.user.socketId
        ) {
            this.player2.new_y += data.d * 100;
        }
    }

    emitToBothPlayers(event: string, data: any, client: Socket): void {
        if (!this.player1.user || !this.player2.user) {
            console.log('no socket id');
            return;
        }
        client.to(this.player1.user.socketId).emit(event, data);
        client.to(this.player2.user.socketId).emit(event, data);
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
                matchId: this.match.id,
            },
            client,
        );
        this.match.updateScore(this.player1.score, this.player2.score);
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
        if (this.player1.score >= winning_condition) {
            this.end(this.player1.user.login, client);
            return;
        } else if (this.player2.score >= winning_condition) {
            this.end(this.player2.user.login, client);
            return;
        }

        this.ball.x += this.ball.dx * 5;
        this.ball.y += this.ball.dy * 5;

        if (this.player1.y != this.player1.new_y) {
            this.player1 = this.smooth_movement(this.player1);
        }
        if (this.player2.y != this.player2.new_y) {
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
                matchId: this.match.id,
            },
            client,
        );
    }
}
