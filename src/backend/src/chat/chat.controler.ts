import { Controller, Get, Post, Param } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { Message } from './entities/message.entity';
import { MessageService } from './services/message.service';
import { ChannelService } from './services/channel.service';
import { User } from '../users/entities/users.entity';
// import { AppService } from './app.service';

@Controller('chat')
export class ChatController {
  // constructor(private readonly appService: AppService) {}
  constructor(
    private readonly channelService: ChannelService,
    private readonly messageService: MessageService,
  ) {}

  // Get /api/chat/id
  @Get('/:id')
  getChannelMessages(@Param('id') id: number): Promise<any> {
    return this.messageService.getMessagesByChannelID(id);
  }

  // Post /api/chat/dm
  @Post('dm')
  postNewChannel(param: { user1: number; user2: number }): Promise<Channel> {
    return this.channelService.newDmChannel(param.user1, param.user2);
  }

  // // Post /api/chat/group
  // @Post('group')
  // postNewGroupChannel(param: { adminUser: number }): Promise<Channel> {
  //   return this.channelService.newGroupChannel(param.adminUser);
  // }

  // Post /api/chat/group/userAdd
  @Post('group/userAdd')
  postUserToChannel(param: { chanelId: number; userId: number }): Promise<any> {
    return this.channelService.addUserToChannel(param.chanelId, param.userId);
  }
}
