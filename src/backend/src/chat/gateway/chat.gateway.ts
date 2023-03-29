import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { MessageService } from '../services/message.service';
import { Message } from '../entities/message.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(
    client: Socket,
    payload: { userId: number; text: string; channelId: number },
  ): void {
    this.server.to('room' + payload.channelId).emit('msgToClient', payload);
    console.log(payload);
    this.messageService.createMessage(payload);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    client: Socket,
    payload: { userId: number; channelId: number },
  ): void {
    client.join('room' + payload.channelId);
    this.server.emit('msgToClient', {
      name: 'server',
      text: `${payload.userId} has joined the room`,
    });
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
