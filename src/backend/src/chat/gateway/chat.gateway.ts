import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { MessageService } from '../services/message.service';
import { Message } from '../entities/message.entity';
import { UserService } from '../../user/services/user/user.service';
import { ChannelService } from '../services/channel.service';
import { promises } from 'dns';

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
  handleMessage(
    client: Socket,
    payload: { userId: number; text: string; channelId: number },
  ): void {
    this.messageService.createMessage(payload);
    this.server.to('room' + payload.channelId).emit('msgToClient', payload);
    this.logger.log(
      `createMessage: message send by ${payload.userId} in channel ${payload.channelId}`,
    );
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    client: Socket,
    payload: { userId: number; channelId: number },
  ): Promise<any> {
    client.join('room' + payload.channelId);
    this.server.emit('msgToClient', {
      name: 'server',
      text: `${payload.userId} has joined the room`,
    });
    const messages = await this.channelService.getMessagesFromChannel(
      payload.channelId,
    );
    messages.forEach((msg) => {
      this.server.emit('msgToClient', {
        name: 'server',
        text: msg.text,
      });
    });
    this.logger.log(`handleJoinRoom: ${client.id} joined the room`);

    // JSON.parse(messages)
    // console.log(JSON.stringify(messages));
    // for (const message in messages) {
    //   console.log('this is message ' + message);
    //   // const msg = await this.messageService.getMessageById(parseInt(message));
    //   // console.log('this is msg.txt ' + JSON.parse(msg));
    // }
  }

  @SubscribeMessage('dmNewUserChannel')
  async dmNewUserChannel(
    client: Socket,
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
