import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PongService } from '../pong.service';
import { MatchService } from '../match/match.service';
import { Match } from '../match/match.entity';

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
        this.pongService.handleConnection(client);
    }

    handleDisconnect(client: Socket): void {
        this.pongService.handleDisconnect(client);
    }

    @SubscribeMessage('joinMatchmaking')
    handleJoinMatchmaking(client: Socket): void {
        this.pongService.handleJoinMatchmaking(client);
    }

    @SubscribeMessage('leaveMatchmaking')
    handleLeaveMatchmaking(client: Socket): void {
        this.pongService.handleLeaveMatchmaking(client);
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
    handleStartPractice(client: Socket, @MessageBody() data: any): void {
        this.pongService.handlePracticeMode(client, data);
    }

    afterInit(client: Socket): void {
        setInterval(() => this.pongService.tick(client), 1000 / 60);
    }
}
