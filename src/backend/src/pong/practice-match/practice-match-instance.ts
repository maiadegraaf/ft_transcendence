import { Logger } from '@nestjs/common';
import { Direction, GameState } from '../enums';
import { Server, Socket } from 'socket.io';
import { Ball } from '../interfaces/ball.interface';
import { Player } from '../interfaces/player.interface';
import { Info } from '../interfaces/info.interface';
import { Difficulty, PracticeMatch } from './practice-match';
import { GameTools } from '../game';

export class PracticeMatchInstance {
    private logger: Logger = new Logger('PongGateway');
    private gamestate: GameState = GameState.Start;
    private winner = '';
    private server: Server;
    private computerSpeed = 3;
    private practiceMatch: PracticeMatch;
    private gameTools: GameTools = new GameTools();
    private ball: Ball = this.gameTools.ball;
    private player: Player = this.gameTools.player1;
    private computer: Player = this.gameTools.player2;

    constructor(server: Server, practiceMatch: PracticeMatch) {
        this.server = server;
        this.practiceMatch = practiceMatch;
    }

    async start(data: any): Promise<void> {
        this.gamestate = GameState.Playing;
        this.player.user = this.practiceMatch.player;
        switch (this.practiceMatch.difficulty) {
            case Difficulty.EASY:
                this.computerSpeed = 2;
                break;
            case Difficulty.NORMAL:
                this.computerSpeed = 3;
                break;
            case Difficulty.HARD:
                this.computerSpeed = 4.5;
                break;
            case Difficulty.EXPERT:
                this.computerSpeed = 5;
        }
    }

    handleDisconnect(client: Socket): void {
        this.computer.score = 10;
        this.end('You lost :(', client);
    }

    returnPlayerSocket() {
        return this.player.user.socketId;
    }

    returnPracticeMatchId() {
        return this.practiceMatch.id;
    }

    returnPracticeMatch() {
        return this.practiceMatch;
    }

    handleMove(client: Socket, data: Info): void {
        if (!client) {
            console.log('no client');
            return;
        }
        if (this.gamestate == GameState.Playing) {
            this.player.new_y += data.d * 100;
        }
    }

    end(winner: string, client: Socket): void {
        this.gamestate = GameState.End;
        this.winner = winner;
        client.emit('PracticeState', {
            ball: this.ball,
            player1: this.player,
            player2: this.computer,
            gamestate: this.gamestate,
            winner: this.winner,
            practiceMatchId: this.practiceMatch.id,
        });
        this.practiceMatch.updateScore(this.player.score, this.computer.score);
    }

    tick(client: Socket): void {
        if (this.gamestate !== GameState.Playing) {
            return;
        }
        if (this.player.score >= this.practiceMatch.winningCondition) {
            this.end('You Won!', client);
            return;
        } else if (this.computer.score >= this.practiceMatch.winningCondition) {
            this.end('You Lost :(', client);
            return;
        }

        this.gameTools.gameLoop(
            this.player,
            this.computer,
            this.ball,
            this.computerSpeed,
        );

        client.emit('PracticeState', {
            ball: this.ball,
            player1: this.player,
            player2: this.computer,
            gamestate: this.gamestate,
            winner: this.winner,
            practiceMatchId: this.practiceMatch.id,
            volley: this.gameTools.volley,
        });
    }
}
