import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

const winning_condition = 10;

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
  score: number;
}

@WebSocketGateway({
  cors: { origin: '*' },
})
export class EventsGateway {
  private logger: Logger = new Logger('EventsGateway');
  private gamestate: GameState = GameState.Start;
  private winner = '';
  private ball: Ball = {
    x: 400,
    y: 300,
    dx: Direction.Left,
    dy: Direction.Up,
  };
  private player1: Player = {
    x: 20,
    y: 250,
    score: 0,
  };
  private player2: Player = {
    x: 760,
    y: 250,
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
      this.player1.y += data * 50;
    }
  }

  @SubscribeMessage('move2')
  handleMove2(@MessageBody() data: Direction, client: Socket): void {
    if (this.gamestate == GameState.Playing) {
      this.player2.y += data * 50;
    }
  }

  @SubscribeMessage('start')
  handleStart(@MessageBody() data: any): void {
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
    this.player1.y = 250;
    this.player2.y = 250;
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

    if (this.ball.y <= 0 || this.ball.y >= 580) {
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
      this.ball.x >= 760 &&
      this.ball.y >= this.player2.y &&
      this.ball.y <= this.player2.y + 100
    ) {
      this.ball.dx *= -1;
    }

    // check for scoring
    if (this.ball.x <= 39) {
      this.player2.score++;
      this.ball.x = 400;
      this.ball.y = 300;
      this.ball.dx = Direction.Left;
      this.ball.dy = Direction.Up;
    }

    if (this.ball.x >= 761) {
      this.player1.score++;
      this.ball.x = 400;
      this.ball.y = 300;
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
