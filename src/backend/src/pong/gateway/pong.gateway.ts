import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PongService } from '../pong.service';
import { Info } from '../interfaces/info.interface';

@WebSocketGateway({
    cors: { origin: '*' },
})
export class PongGateway implements OnGatewayDisconnect {
    constructor(private readonly pongService: PongService) {}

    @WebSocketServer() server: Server;
    handleConnection(@ConnectedSocket() client: Socket): void {
        const userId = client.handshake.query.userId;
        console.log('Client Connected ' + client.id);
        this.pongService.handleConnection(client, userId);
    }

    handleDisconnect(@ConnectedSocket() client: Socket): void {
        this.pongService.handleDisconnect(client);
    }

    @SubscribeMessage('disconnect')
    handleDisconnectMessage(@ConnectedSocket() client: Socket): void {
        this.pongService.handleDisconnect(client);
    }

    @SubscribeMessage('joinMatchmaking')
    handleJoinMatchmaking(
        @ConnectedSocket() client: Socket,
        @MessageBody() userId: number,
    ): void {
        this.pongService.handleJoinMatchmaking(client, userId);
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
        this.pongService.handleMove(client, data);
    }

    @SubscribeMessage('addSocketToPlayer')
    handleAddSocketToPlayer(
        @ConnectedSocket() client: Socket,
        @MessageBody() userId: number,
    ): void {
        this.pongService.addSocketIdToUser(userId, client);
    }

    @SubscribeMessage('create match')
    handleCreateMatch(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any,
    ): void {
        this.pongService.handleCreateMatch(client, data.player1, data.player2);
    }

    // @SubscribeMessage('start')
    // handleStart(): void {
    //     this.pongService.handleStart();
    // }

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
