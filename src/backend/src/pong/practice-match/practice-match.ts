import { Logger } from '@nestjs/common';
import { Direction, GameState } from '../enums';
import { Server, Socket } from 'socket.io';
import { Difficulty, PracticeMatchEntity } from './practice-match.entity';
import { Ball } from '../interfaces/ball.interface';
import { Player } from '../interfaces/player.interface';
import { Info } from '../interfaces/info.interface';
import { PracticeMatchService } from './practice-match.service';

const height = 450;
const width = 800;
const max_y = height - 15;
const min_y = 10;
export class PracticeMatch {
    private logger: Logger = new Logger('PongGateway');
    private gamestate: GameState = GameState.Start;
    private winner = '';
    private winning_condition = 10;
    private readonly practiceMatch: PracticeMatchEntity;
    private server: Server;
    private computerSpeed = 3;

    private ball: Ball = {
        x: width / 2,
        y: height / 2,
        dx: Direction.Left,
        dy: Direction.Up,
    };

    private player: Player = {
        user: null,
        x: 20,
        y: height / 2 - 50,
        new_y: height / 2 - 50,
        score: 0,
    };

    private computer: Player = {
        user: null,
        x: width - 20,
        y: height / 2 - 50,
        new_y: height / 2 - 50,
        score: 0,
    };

    constructor(
        server: Server,
        practiceMatch: PracticeMatchEntity,
        private practiceMatchServices: PracticeMatchService,
    ) {
        this.server = server;
        this.practiceMatch = practiceMatch;
    }

    async start(data: any): Promise<void> {
        console.log('from practice-match: start');
        this.gamestate = GameState.Playing;
        this.player.user = this.practiceMatch.player;
        this.winning_condition = data.score;
        this.practiceMatchServices.updateWinningCondition(
            this.practiceMatch,
            this.winning_condition,
        );
        switch (data.difficulty) {
            case 'easy':
                this.computerSpeed = 2;
                break;
            case 'normal':
                await this.practiceMatchServices.updateDifficulty(
                    this.practiceMatch,
                    Difficulty.NORMAL,
                );
                this.computerSpeed = 3;
                break;
            case 'hard':
                await this.practiceMatchServices.updateDifficulty(
                    this.practiceMatch,
                    Difficulty.HARD,
                );
                this.computerSpeed = 4.5;
                break;
            case 'impossible':
                await this.practiceMatchServices.updateDifficulty(
                    this.practiceMatch,
                    Difficulty.IMPOSSIBLE,
                );
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

    handleMove(client: Socket, data: Info): void {
        if (!client) {
            console.log('no client');
            return;
        }
        console.log('SOCKET: ' + client.id + ' move: ' + data);
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
        });
        this.practiceMatchServices.updateScore(
            this.practiceMatch,
            this.player.score,
            this.computer.score,
        );
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
        if (this.player.score >= this.winning_condition) {
            this.end('You Won!', client);
            return;
        } else if (this.computer.score >= this.winning_condition) {
            this.end('You Lost :(', client);
            return;
        }

        this.ball.x += this.ball.dx * 5;
        this.ball.y += this.ball.dy * 5;

        if (this.ball.x >= width / 2) {
            this.computer.new_y = this.ball.y - 20;
            if (this.computer.y != this.computer.new_y) {
                if (this.computer.y > this.computer.new_y) {
                    this.computer.y += -this.computerSpeed;
                } else {
                    this.computer.y += this.computerSpeed;
                }
            }
            this.computer = this.check_out_of_bounds(this.computer);
        }

        if (this.player.y != this.player.new_y) {
            this.player = this.smooth_movement(this.player);
        }

        if (this.ball.y <= 0 || this.ball.y >= max_y - 10) {
            this.ball.dy *= -1;
        }

        // check for collision with player
        if (
            this.ball.x <= 40 &&
            this.ball.y >= this.player.y &&
            this.ball.y <= this.player.y + 100
        ) {
            this.ball.dx *= -1;
        }

        // check for collision with computer
        if (
            this.ball.x >= width - 60 &&
            this.ball.y >= this.computer.y &&
            this.ball.y <= this.computer.y + 100
        ) {
            this.ball.dx *= -1;
        }

        // check for scoring
        if (this.ball.x <= 35) {
            this.computer.score++;
            this.ball.x = width / 2;
            this.ball.y = height / 2;
            this.ball.dx = Direction.Left;
            this.ball.dy = Direction.Up;
        }

        if (this.ball.x >= width - 38) {
            this.player.score++;
            this.ball.x = width / 2;
            this.ball.y = height / 2;
            this.ball.dx = Direction.Right;
            this.ball.dy = Direction.Down;
        }

        client.emit('PracticeState', {
            ball: this.ball,
            player1: this.player,
            player2: this.computer,
            gamestate: this.gamestate,
            winner: this.winner,
        });
    }
}
