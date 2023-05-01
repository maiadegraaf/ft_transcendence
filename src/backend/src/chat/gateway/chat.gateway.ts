import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Body, Logger, UseGuards, ValidationPipe } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { MessageService } from '../services/message.service';
import { UserService } from '../../user/services/user/user.service';
import { ChannelService } from '../services/channel.service';
import { JoinRoomDto, MessageDto } from '../dtos/chat.dtos';
import { websocketGuard } from '../../auth/auth.guard';

@UseGuards(websocketGuard)
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private readonly messageService: MessageService,
        private readonly userService: UserService,
    ) {}

    @WebSocketServer()
    server: Server;

    private readonly clientMap: Map<number, Socket> = new Map<number, Socket>();
    private logger: Logger = new Logger('ChatGateway');

    @SubscribeMessage('msgToServer')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @Body(new ValidationPipe()) payload: MessageDto,
    ): Promise<any> {
        const message = await this.messageService.createMessage(payload);
        payload.id = message.id;
        this.server.to('room' + payload.channel).emit('msgToClient', payload);
        this.logger.log(
            `createMessage: message send by ${payload.sender} in channel ${payload.channel}`,
        );
    }

    @SubscribeMessage('joinRoomById')
    async handleJoinRoomById(
        @ConnectedSocket() client: Socket,
        @Body() payload: { channelId: number },
    ): Promise<any> {
        await client.join('room' + payload.channelId);
        this.logger.log(
            `handleJoinRoomById: ${client.id} joined the room with id: ${payload.channelId}`,
        );
    }

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @Body(new ValidationPipe()) payload: JoinRoomDto,
    ): Promise<any> {
        await client.join('room' + payload.channelId);
        const userName = await this.userService.getUserNameById(payload.userId);
        this.server.to('room' + payload.channelId).emit('msgToClient', {
            id: -1,
            sender: payload.userId,
            senderName: userName,
            channel: payload.channelId,
            text: `${payload.userName} (${payload.userId}) has joined the room with channel id: ${payload.channelId}`,
        });
        this.logger.log(
            `handleJoinRoom: ${client.id} joined the room with id: ${payload.channelId}`,
        );
    }

    @SubscribeMessage('leaveRoom')
    async handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @Body(new ValidationPipe()) payload: JoinRoomDto,
    ) {
        await client.leave('room' + payload.channelId);
        const userName = await this.userService.getUserNameById(payload.userId);
        this.server.to('room' + payload.channelId).emit('msgToClient', {
            id: -1,
            sender: payload.userId,
            senderName: userName,
            channel: payload.channelId,
            text: `${payload.userName} (${payload.userId}) has left the room with channel id: ${payload.channelId}`,
        });
        this.logger.log(
            `handleLeaveRoom: ${client.id} left the room with id: ${payload.channelId}`,
        );
    }

    @SubscribeMessage('checkUserOnline')
    async handleCheckUserOnline(
        @ConnectedSocket() client: Socket,
        @Body() payload: { userId: number },
    ) {
        if (this.clientMap.has(payload.userId)) {
            client.emit('userOnline', { userId: payload.userId });
        } else {
            client.emit('userOffline', { userId: payload.userId });
        }
    }

    getClientSocketById(userId: number): Socket {
        if (this.clientMap.has(userId)) {
            return this.clientMap.get(userId);
        }
        return null;
    }

    afterInit(server: Server) {
        this.logger.log('Init chat');
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        const userId = client.request.session.user.id;
        if (this.clientMap.has(parseInt(userId.toString()))) {
            this.clientMap.delete(parseInt(userId.toString()));
            this.logger.log(
                `Client disconnected to chat: ${client.id} with userId: ${userId}`,
            );
        }
    }

    handleConnection(@ConnectedSocket() client: Socket) {
        const userId = client.request.session.user.id;
        this.clientMap.set(parseInt(userId.toString()), client);
        this.logger.log(userId + ' connected to chat');
    }
}
