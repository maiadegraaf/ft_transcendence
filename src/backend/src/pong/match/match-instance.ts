import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Match } from './match';
import { Direction, GameState } from '../enums';
import { Ball } from '../interfaces/ball.interface';
import { Player } from '../interfaces/player.interface';
import { Info } from '../interfaces/info.interface';
import { GameTools } from '../game';

const winning_condition = 10;

@Injectable()
export class MatchInstance {
    private logger: Logger = new Logger('PongGateway');
    private gamestate: GameState = GameState.Start;
    private winner = '';
    private readonly match: Match;
    private server: Server;
    private gameTools: GameTools = new GameTools();
    private ball: Ball = this.gameTools.ball;
    private player1: Player = this.gameTools.player1;
    private player2: Player = this.gameTools.player2;

    constructor(server: Server, match: Match) {
        this.server = server;
        this.match = match;
    }

    async start(): Promise<void> {
        this.gamestate = GameState.Playing;
        this.player1.user = this.match.player1;
        this.player2.user = this.match.player2;
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
    }

    tick(client: Socket): void {
        if (this.gamestate !== GameState.Playing) {
            return;
        }
        if (this.player1.score >= winning_condition) {
            this.end(this.player1.user.login + ' Won!', client);
            return;
        } else if (this.player2.score >= winning_condition) {
            this.end(this.player2.user.login + ' Won!', client);
            return;
        }

        this.gameTools.gameLoop(this.player1, this.player2, this.ball, 0);

        this.emitToBothPlayers(
            'state',
            {
                ball: this.ball,
                player1: this.player1,
                player2: this.player2,
                gamestate: this.gamestate,
                winner: this.winner,
                matchId: this.match.id,
                volley: this.gameTools.volley,
            },
            client,
        );
    }

    returnPlayer(number: number) {
        if (number == 1) {
            return this.player1;
        } else if (number == 2) {
            return this.player2;
        }
    }
}
