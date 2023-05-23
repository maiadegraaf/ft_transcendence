import {
    ConnectedSocket,
    MessageBody,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PongService } from '../pong.service';
import { Info } from '../interfaces/info.interface';
import { UseGuards } from '@nestjs/common';
import { WebSocketGuard } from '../../auth/auth.guard';

@WebSocketGateway({
    cors: { origin: '*' },
})
@UseGuards(WebSocketGuard)
export class PongGateway implements OnGatewayDisconnect {
    constructor(private readonly pongService: PongService) {}

    @WebSocketServer() server: Server;

    @SubscribeMessage('disconnect')
    handleDisconnectMessage(@ConnectedSocket() client: Socket): void {
        this.pongService.handleDisconnect(client);
    }

    @SubscribeMessage('joinMatchmaking')
    handleJoinMatchmaking(
        @ConnectedSocket() client: Socket,
        @MessageBody() userId: number,
    ): void {
        console.log('joinMatchmaking');
        console.log(userId);
        this.pongService.handleJoinMatchmaking(client, userId);
    }

    @SubscribeMessage('joinMatchmakingOneVOne')
    handleJoinMatchmakingOneVOne(
        @ConnectedSocket() client: Socket,
        @MessageBody()
        data: { userId: number; senderId: number; opponentId: number },
    ): void {
        console.log('joinMatchmakingOneVOne');
        console.log(data.userId);
        this.pongService.handleJoinMatchmakingOneVOne(
            client,
            data.userId,
            data.senderId,
            data.opponentId,
        );
    }

    @SubscribeMessage('leaveMatchmaking')
    handleLeaveMatchmaking(@ConnectedSocket() client: Socket): void {
        this.pongService.handleLeaveMatchmaking(client);
    }

    @SubscribeMessage('leaveMatchmakingOneVOne')
    handleLeaveMatchmakingOneVOne(@ConnectedSocket() client: Socket): void {
        this.pongService.handleLeaveMatchmaking(client);
    }

    @SubscribeMessage('move')
    handleMove(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: Info,
    ): void {
        this.pongService.handleMove(client, data);
    }

    @SubscribeMessage('bind')
    handleAddSocketToPlayer(
        @ConnectedSocket() client: Socket,
        @MessageBody() userId: number,
    ): void {
        this.pongService.addSocketIdToUser(userId, client);
    }

    @SubscribeMessage('createMatch')
    handleCreateMatch(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any,
    ): void {
        this.pongService.handleCreateMatch(client, data.player1, data.player2);
    }

    @SubscribeMessage('start practice')
    handleStartPractice(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: any,
    ): void {
        this.pongService.handlePracticeMode(client, data);
    }

    handleDisconnect(@ConnectedSocket() client: Socket): void {
        this.pongService.handleDisconnect(client);
    }

    afterInit(@ConnectedSocket() client: Socket): void {
        setInterval(() => this.pongService.tick(client), 1000 / 60);
    }

    handleConnection(@ConnectedSocket() client: Socket): void {
        if (!client.request.session.user) {
            client.disconnect();
            return;
        }
        const userId = client.request.session.user.id;
        this.pongService.handleConnection(client, userId);
    }
}
