import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
} from '@nestjs/websockets';
import {
    Body,
    UseGuards,
    HttpException,
    HttpStatus,
    Logger,
    ValidationPipe,
} from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { MessageService } from '../services/message.service';
import { UserService } from '../../user/services/user/user.service';
import { JoinRoomDto, MessageDto } from '../dtos/chat.dtos';
import { websocketGuard } from '../../auth/auth.guard';
import { Channel } from '../entities/channel.entity';
import { User } from '../../user/user.entity';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@UseGuards(websocketGuard)
export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private readonly messageService: MessageService) {}

    @WebSocketServer()
    server: Server;

    private readonly clientMap: Map<number, Socket> = new Map<number, Socket>();
    private logger: Logger = new Logger('ChatGateway');

    afterInit(server: Server) {
        this.logger.log('Init chat');
    }

    handleConnection(@ConnectedSocket() client: Socket) {
        if (!client.request.session.user) {
            client.disconnect();
            return;
        }
        const userId: number = client.request.session.user.id;
        this.clientMap.set(userId, client);
        this.server.to('user:' + userId).emit('userOnline', userId);
        this.logger.log(userId + ' connected to chat with id: ' + client.id);
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        if (!client.request.session.user) {
            this.clientMap.forEach((value, key) => {
                if (value.id === client.id) {
                    this.clientMap.delete(key);
                    this.server.to('user:' + key).emit('userOffline', key);
                    this.logger.log(
                        `Client disconnected to chat: ${client.id} with userId: ${key}`,
                    );
                }
            });
            return;
        }

        const userId = client.request.session.user.id;
        if (this.clientMap.has(parseInt(userId.toString()))) {
            this.server.to('user:' + userId).emit('userOffline', userId);
            this.clientMap.delete(parseInt(userId.toString()));
            this.logger.log(
                `Client disconnected to chat: ${client.id} with userId: ${userId}`,
            );
        }
    }

    @SubscribeMessage('msgToServer')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @Body(new ValidationPipe()) payload: MessageDto,
    ): Promise<any> {
        try {
            const message = await this.messageService.createMessage(payload);
            if (!message) {
                throw new HttpException(
                    'handleMessage: message could not be created',
                    HttpStatus.FORBIDDEN,
                );
            }
            payload.id = message.id;
            this.server
                .to('room' + payload.channel)
                .emit('msgToClient', payload);
            this.logger.log(
                `createMessage: message send by ${payload.sender.login} in channel ${payload.channel} with message ${payload.text}`,
            );
        } catch (error) {
            this.logger.error(error);
        }
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

    @SubscribeMessage('leaveRoomById')
    async handleLeaveRoomById(
        @ConnectedSocket() client: Socket,
        @Body() payload: { channelId: number },
    ): Promise<any> {
        await client.leave('room' + payload.channelId);
        this.logger.log(
            `handleLeaveRoomById: ${client.id} left the room with id: ${payload.channelId}`,
        );
    }

    @SubscribeMessage('checkUserOnline')
    async handleCheckUserOnline(
        @ConnectedSocket() client: Socket,
        @Body() payload: { userId: number },
    ) {
        client.join('user:' + payload.userId);
        if (this.clientMap.has(parseInt(payload.userId.toString()))) {
            client.emit('userOnline', payload.userId);
        } else {
            client.emit('userOffline', payload.userId);
        }
    }

    getClientSocketById(userId: number): Socket {
        if (this.clientMap.has(userId)) {
            return this.clientMap.get(userId);
        }
        return null;
    }

    async emitNewDmChannel(
        user1: User,
        user2: User,
        channel: Channel,
    ): Promise<any> {
        const user1Socket = this.getClientSocketById(user1.id);
        if (user1Socket) {
            this.logger.log(
                'emit addChannelToClient form user1: ' + user1Socket.id,
            );
            user1Socket.emit('addChannelToClient', channel);
        }
        const user2Socket = this.getClientSocketById(user2.id);
        if (user2Socket) {
            this.logger.log(
                'emit addChannelToClient form user2: ' + user2Socket.id,
            );
            user2Socket.emit('addChannelToClient', channel);
        }
    }

    async emitGroupChannelToUser(channel: Channel, user: User): Promise<any> {
        const userSocket = this.getClientSocketById(user.id);
        if (userSocket) {
            this.logger.log(
                'emit addChannelToClient to user: ' + userSocket.id,
            );
            userSocket.emit('addChannelToClient', channel);
            return;
        }
        this.logger.error('User is not connected to chat');
    }

    async emitDeleteChannelFromUser(
        channel: Channel,
        user: User,
    ): Promise<any> {
        try {
            this.server.to('room' + channel.id).emit('removeUserFromChannel', {
                channelId: channel.id,
                user: { id: user.id, login: user.login },
            });
            const userSocket = this.getClientSocketById(user.id);
            if (!userSocket) {
                throw new HttpException(
                    'User is not connected to chat',
                    HttpStatus.FORBIDDEN,
                );
            }
            userSocket.emit('removeChannelFromClient', channel.id);
            this.logger.log(
                'emit deleteChannelFromClient form owner: ' + userSocket.id,
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    async emitAddAdminToChannel(info: {
        channelId: number;
        user: {
            id: number;
            login: string;
        };
    }): Promise<any> {
        this.server.to('room' + info.channelId).emit('addAdminToChannel', info);
        this.logger.log('emitAddAdminToChannel for user: ' + info.user.id);
    }

    async emitRemoveAdminFromChannel(info: {
        channelId: number;
        user: {
            id: number;
            login: string;
        };
    }): Promise<any> {
        this.server
            .to('room' + info.channelId)
            .emit('removeAdminFromChannel', info);
        this.logger.log('emitRemoveAdminFromChannel for user: ' + info.user.id);
    }

    async emitAddMutedToChannelToUser(info: {
        channelId: number;
        user: {
            id: number;
            login: string;
        };
    }): Promise<any> {
        this.server.to('room' + info.channelId).emit('addMutedToChannel', info);
        this.logger.log(
            'emitAddMutedToChannelToUser for user: ' + info.user.id,
        );
    }

    async emitRemoveMutedFromChannelToUser(info: {
        channelId: number;
        user: {
            id: number;
            login: string;
        };
    }): Promise<any> {
        this.server
            .to('room' + info.channelId)
            .emit('removeMutedFromChannel', info);
        this.logger.log(
            'emitRemoveMutedFromChannelToUser for user: ' + info.user.id,
        );
    }
}
