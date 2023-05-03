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
import { GroupProfile } from '../entities/groupProfile.entity';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@UseGuards(websocketGuard)
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
            `createMessage: message send by ${payload.sender.login} in channel ${payload.channel}`,
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
        if (this.clientMap.has(parseInt(userId.toString()))) {
            return this.clientMap.get(parseInt(userId.toString()));
        }
        return null;
    }

    afterInit(server: Server) {
        this.logger.log('Init chat');
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        if (!client.request.session.user) {
            this.clientMap.forEach((value, key) => {
                if (value.id === client.id) {
                    this.clientMap.delete(key);
                    this.logger.log(
                        `Client disconnected to chat: ${client.id} with userId: ${key}`,
                    );
                }
            });
            return;
        }

        const userId = client.request.session.user.id;
        if (this.clientMap.has(parseInt(userId.toString()))) {
            this.clientMap.delete(parseInt(userId.toString()));
            this.logger.log(
                `Client disconnected to chat: ${client.id} with userId: ${userId}`,
            );
        }
    }

    handleConnection(@ConnectedSocket() client: Socket) {
        if (!client.request.session.user) {
            client.disconnect();
            return;
        }
        const userId = client.request.session.user.id;
        this.clientMap.set(parseInt(userId.toString()), client);
        this.logger.log(userId + ' connected to chat');
        this.logger.log('Chat connected');
    }

    async emitNewDmChannel(
        user1: User,
        user2: User,
        channel: Channel,
    ): Promise<any> {
        const channelInfo = {
            id: channel.id,
            messages: [],
            profile: null,
            name: user2.login,
        };
        const user1Socket = this.getClientSocketById(user1.id);
        if (user1Socket) {
            this.logger.log(
                'emit addChannelToClient form user1: ' + user1Socket.id,
            );
            user1Socket.emit('addChannelToClient', channelInfo);
        }
        channelInfo.name = user1.login;
        const user2Socket = this.getClientSocketById(user2.id);
        if (user2Socket) {
            this.logger.log(
                'emit addChannelToClient form user2: ' + user2Socket.id,
            );
            user2Socket.emit('addChannelToClient', channelInfo);
        }
    }

    async emitGroupChannelToUser(channel: Channel, user: User): Promise<any> {
        const channelInfo = {
            id: channel.id,
            messages: [],
            profile: channel.profile,
            name: channel.profile.name,
        };
        const userSocket = this.getClientSocketById(user.id);
        if (userSocket) {
            this.logger.log(
                'emit addChannelToClient to user: ' + userSocket.id,
            );
            userSocket.emit('addChannelToClient', channelInfo);
        }
        this.logger.error('User is not connected to chat');
    }

    async emitDeleteChannelFromUser(
        channel: Channel,
        user: User,
    ): Promise<any> {
        const userSocket = this.getClientSocketById(user.id);
        if (!userSocket) {
            throw new HttpException(
                'User is not connected to chat',
                HttpStatus.FORBIDDEN,
            );
        }
        this.logger.log(
            'emit deleteChannelFromClient form owner: ' + userSocket.id,
        );
        userSocket.emit('removeChannelFromClient', channel.id);
    }
}
