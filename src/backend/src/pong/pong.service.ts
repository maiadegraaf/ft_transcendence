import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

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
  private ball: Ball = {
    x: width / 2,
    y: height / 2,
    dx: Direction.Left,
    dy: Direction.Up,
  };
  private player1: Player = {
    x: 20,
    y: height / 2 - 50,
    new_y: height / 2 - 50,
    score: 0,
  };
  private player2: Player = {
    x: width - 20,
    y: height / 2 - 50,
    new_y: height / 2 - 50,
    score: 0,
  };

  constructor(private readonly server: Server) {}

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('gamestate', this.gamestate);
  }

  handleStart(): void {
    this.gamestate = GameState.Playing;
  }

  handlePracticeMode(data: any): void {
    this.gamestate = GameState.Playing;
    this.practiceMode = true;
    this.winning_condition = data.score;
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
    if (this.gamestate == GameState.Playing) {
      this.player1.new_y += data * 100;
    }
  }

  handleMove2(data: Direction, client: Socket): void {
    if (this.gamestate == GameState.Playing && this.practiceMode == false) {
      this.player2.new_y += data * 100;
    }
  }

  end(client: Socket, winner: string): void {
    this.gamestate = GameState.End;
    this.winner = winner;
    client.emit('state', {
      ball: this.ball,
      player1: this.player1,
      player2: this.player2,
      gamestate: this.gamestate,
      winner: this.winner,
    });
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
      this.end(client, 'Player 1');
      return;
    } else if (this.player2.score >= this.winning_condition) {
      this.end(client, 'Player 2');
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
    if (this.player2.y != this.player2.new_y && this.practiceMode == false) {
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

    client.emit('state', {
      ball: this.ball,
      player1: this.player1,
      player2: this.player2,
      gamestate: this.gamestate,
      winner: this.winner,
    });
  }
}
