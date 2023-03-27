import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PongService } from '../pong.service';
import { Match } from '../entities/match.entity';

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

    private match: Match = null;
    @WebSocketServer() server: Server;

    handleConnection(client: Socket): void {
        console.log('connected');
        this.pongService.handleConnection(client);
    }

    @SubscribeMessage('joinWaitlist')
    handleJoinWaitlist(client: Socket): void {
        this.pongService.handleJoinWaitlist(client);
    }

    @SubscribeMessage('leaveWaitlist')
    handleLeaveWaitlist(client: Socket): void {
        this.pongService.handleLeaveWaitlist(client);
    }

    @SubscribeMessage('move')
    handleMove(@MessageBody() data: Direction, client: Socket): void {
        this.pongService.handleMove(data, client);
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
