import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PongService } from '../pong.service';

enum Direction {
  Up = -1,
  Down = 1,
  Left = -1,
  Right = 1,
}

@WebSocketGateway({
  cors: { origin: '*' },
})
export class PongGateway {
  constructor(private readonly pongService: PongService) {}
  @WebSocketServer() server: Server;

  handleConnection(client: Socket): void {
    this.pongService.handleConnection(client);
  }
  @SubscribeMessage('move')
  handleMove(@MessageBody() data: Direction, client: Socket): void {
    this.pongService.handleMove(data, client);
  }

  @SubscribeMessage('move2')
  handleMove2(@MessageBody() data: Direction, client: Socket): void {
    this.pongService.handleMove2(data, client);
  }

  @SubscribeMessage('start')
  handleStart(): void {
    this.pongService.handleStart();
  }

  @SubscribeMessage('start practice')
  handleStartPractice(@MessageBody() data: any): void {
    this.pongService.handlePracticeMode(data);
  }

  afterInit(client: Socket): void {
    setInterval(() => this.pongService.tick(client), 1000 / 60);
  }
}
