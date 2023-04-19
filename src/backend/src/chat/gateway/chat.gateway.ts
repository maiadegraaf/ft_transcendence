import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Body, Logger, ValidationPipe } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { MessageService } from '../services/message.service';
import { UserService } from '../../user/services/user/user.service';
import { ChannelService } from '../services/channel.service';
import { JoinRoomDto, MessageDto } from '../dtos/chat.dtos';

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
        private readonly channelService: ChannelService,
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

    getClientSocketById(userId: number): Socket {
        if (this.clientMap.has(userId)) {
            return this.clientMap.get(userId);
        }
        return null;
    }

    afterInit(server: Server) {
        this.logger.log('Init chat');
    }

    handleDisconnect(client: Socket, ...args: any[]) {
        const userId = client.handshake.query.userId;
        if (this.clientMap.has(parseInt(userId.toString()))) {
            this.clientMap.delete(parseInt(userId.toString()));
            this.logger.log(
                `Client disconnected to chat: ${client.id} with userId: ${userId}`,
            );
        }
    }

    handleConnection(client: Socket, ...args: any[]) {
        const userId = client.handshake.query.userId;
        // console.log('user connected: with id: ' + userId);
        // const userName = client.handshake.query.userName;
        this.clientMap.set(parseInt(userId.toString()), client);
        this.logger.log(
            `Client connected to chat: ${client.id} with userId: ${userId}`,
        );
    }
}
