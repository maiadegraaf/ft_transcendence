import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

const winning_condition = 10;
const max_y = 490;
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

@WebSocketGateway( {
  cors: { origin: '*' },
})
export class PongGateway {
  private logger: Logger = new Logger('PongGateway');
  private gamestate: GameState = GameState.Start;
  private winner = '';
  private width = 800;
  private height = 600;
  private ball: Ball = {
    x: this.width / 2,
    y: this.height / 2,
    dx: Direction.Left,
    dy: Direction.Up,
  };
  private player1: Player = {
    x: 20,
    y: this.height / 2 - 50,
    new_y: this.height / 2 - 50,
    score: 0,
  };
  private player2: Player = {
    x: this.width - 20,
    y: this.height / 2 - 50,
    new_y: this.height / 2 - 50,
    score: 0,
  };

  @WebSocketServer() server: Server;
  @SubscribeMessage('move')
  handleMove(@MessageBody() data: Direction, client: Socket): void {
    // const sockets = await this.server.fetchSockets();
    // const socketIds = sockets.map((socket) => socket.id);
    // const playerIndex = socketIds.indexOf(client.id) % 2;
    // const player = playerIndex === 0
    //     ? this.player1
    //     : this.player2;
    if (this.gamestate == GameState.Playing) {
      this.player1.new_y += data * 100;
    }
  }

  @SubscribeMessage('move2')
  handleMove2(@MessageBody() data: Direction, client: Socket): void {
    if (this.gamestate == GameState.Playing) {
      this.player2.y += data * 50;
    }
  }

  @SubscribeMessage('size')
  handleSize(@MessageBody() data: any): void {
    this.width = data.w;
    this.height = data.h;
    console.log(this.width, ' , ', this.height);
  }

  @SubscribeMessage('start')
  handleStart(): void {
    this.gamestate = GameState.Playing;
  }

  // @SubscribeMessage('end')
  // handleEnd(@MessageBody() data: any): void {
  //   this.gamestate = GameState.End;
  //   this.player1.score = 0;
  //   this.player2.score = 0;
  // }
  end(winner): void {
    this.gamestate = GameState.End;
    this.winner = winner;
    this.server.emit('state', {
      ball: this.ball,
      player1: this.player1,
      player2: this.player2,
      gamestate: this.gamestate,
      winner: this.winner,
    });
    this.player1.score = 0;
    this.player2.score = 0;
    this.player1.y = this.height / 2 - 50;
    this.player2.y = this.height / 2 - 50;
  }

  check_out_of_bounds(player): typeof player {
    if (player.y > this.height - 110) {
      player.y = this.height - 110;
      player.new_y = this.height - 110;
    } else if (player.y < 10) {
      player.y = 10;
      player.new_y = 10;
      console.log(player.y);
    }
    return player;
  }

  tick(): void {
    if (this.gamestate !== GameState.Playing) {
      return;
    }
    if (this.player1.score >= winning_condition) {
      this.end('Player 1');
      return;
    } else if (this.player2.score >= winning_condition) {
      this.end('Player 2');
      return;
    }

    this.ball.x += this.ball.dx * 5;
    this.ball.y += this.ball.dy * 5;

    if (this.ball.x >= this.width / 2) {
      this.player2.new_y = this.ball.y - 20;
      if (this.player2.y != this.player2.new_y) {
        if (this.player2.y > this.player2.new_y) {
          this.player2.y += -4;
        } else {
          this.player2.y += 4;
        }
      }
      this.player2 = this.check_out_of_bounds(this.player2);
    }

    if (this.player1.new_y != this.player1.y) {
      if (this.player1.new_y < this.player1.y) {
        this.player1.y += -5;
      } else {
        this.player1.y += 5;
      }
      this.player1 = this.check_out_of_bounds(this.player1);
    }

    if (this.ball.y <= 0 || this.ball.y >= this.height - 20) {
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
      this.ball.x >= this.width - 60 &&
      this.ball.y >= this.player2.y &&
      this.ball.y <= this.player2.y + 100
    ) {
      this.ball.dx *= -1;
    }

    // check for scoring
    if (this.ball.x <= 35) {
      this.player2.score++;
      this.ball.x = this.width / 2;
      this.ball.y = this.height / 2;
      this.ball.dx = Direction.Left;
      this.ball.dy = Direction.Up;
    }

    if (this.ball.x >= this.width - 38) {
      this.player1.score++;
      this.ball.x = this.width / 2;
      this.ball.y = this.height / 2;
      this.ball.dx = Direction.Right;
      this.ball.dy = Direction.Down;
    }

    this.server.emit('state', {
      ball: this.ball,
      player1: this.player1,
      player2: this.player2,
      gamestate: this.gamestate,
      winner: this.winner,
    });
  }

  afterInit(): void {
    setInterval(() => this.tick(), 1000 / 60);
  }
}
