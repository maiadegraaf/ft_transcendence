import {
    ConnectedSocket,
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

interface Info {
    d: Direction;
    matchId: number;
}

@WebSocketGateway({
    cors: { origin: '*' },
})
export class PongGateway {
    constructor(private readonly pongService: PongService) {}

    private match: Match = null;
    @WebSocketServer() server: Server;

    handleConnection(@ConnectedSocket() client: Socket): void {
        this.pongService.handleConnection(client);
    }

    handleDisconnect(@ConnectedSocket() client: Socket): void {
        this.pongService.handleDisconnect(client);
    }

    @SubscribeMessage('joinMatchmaking')
    handleJoinMatchmaking(@ConnectedSocket() client: Socket): void {
        this.pongService.handleJoinMatchmaking(client);
    }

    @SubscribeMessage('leaveMatchmaking')
    handleLeaveMatchmaking(@ConnectedSocket() client: Socket): void {
        this.pongService.handleLeaveMatchmaking(client);
    }

    @SubscribeMessage('move')
    handleMove(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: Info,
    ): void {
        this.pongService.handleMove(data, client);
    }

    @SubscribeMessage('start')
    handleStart(): void {
        this.pongService.handleStart();
    }

    @SubscribeMessage('start practice')
    handleStartPractice(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any,
    ): void {
        this.pongService.handlePracticeMode(client, data);
    }

    afterInit(@ConnectedSocket() client: Socket): void {
        setInterval(() => this.pongService.tick(client), 1000 / 60);
    }
}
