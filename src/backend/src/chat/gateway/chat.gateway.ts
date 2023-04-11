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
import { Message } from '../entities/message.entity';
import { UserService } from '../../user/services/user/user.service';
import { ChannelService } from '../services/channel.service';
import { promises } from 'dns';
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

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    @SubscribeMessage('msgToServer')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @Body(new ValidationPipe()) payload: MessageDto,
    ): Promise<any> {
        // 1 validation pipe for the payload
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
        await client;
        if (!client) {
            this.logger.error('handleJoinRoom: client is undefined');
            return;
        }
        await client.join('room' + payload.channelId);
        const userName = await this.userService.getUserNameById(payload.userId);
        this.server.emit('msgToClient', {
            id: -1,
            sender: payload.userId,
            senderName: userName,
            channel: payload.channelId,
            text: `${payload.userName} (${payload.userId}) has joined the room`,
        });
        this.logger.log(`handleJoinRoom: ${client.id} joined the room`);
    }

    @SubscribeMessage('dmNewUserChannel')
    async dmNewUserChannel(
        @ConnectedSocket() client: Socket,
        payload: { userName: string; userId: number },
    ): Promise<any> {
        const user2 = await this.userService.getUserByName(payload.userName);
        if (!user2) {
            console.log('Do something');
        }
        const channel = await this.channelService.newDmChannel(
            payload.userId,
            user2.id,
        );
        return channel;
    }

    afterInit(server: Server) {
        this.logger.log('Init chat');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected to chat: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected to chat: ${client.id}`);
    }
}
