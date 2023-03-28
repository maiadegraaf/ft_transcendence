import { Controller, Get, Post, Param } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { Message } from './entities/message.entity';
import { MessageService } from './services/message.service';
import { ChannelService } from './services/channel.service';
import { User } from '../user/entities/user.entity';
// import { AppService } from './app.service';

@Controller('chat')
export class ChatController {
  // constructor(private readonly appService: AppService) {}
  constructor(
    private readonly channelService: ChannelService,
    private readonly messageService: MessageService,
  ) {}

  // // Get /api/chat/channel/id
  // @Get('channel/:id')
  // getChannel(@Param('id') id: number): Promise<Channel> {
  //   return this.channelService.getChannel(id);
  // }

  // Get /api/chat/id
  @Get('/:id')
  getChannelMessages(@Param('id') id: number): Promise<any> {
    return this.messageService.getMessagesByChannelID(id);
  }

  // Post /api/chat/newDm
  @Post('newDm')
  postNewChannel(): Promise<Channel> {
    return this.channelService.createChannel();
  }

  // Post /api/chat/newGroup
  @Post('newGroup')
  addUserToChannel(param: { chanelId: number; userId: number }): Promise<any> {
    return this.channelService.addUserToChannel(param.chanelId, param.userId);
  }
}
