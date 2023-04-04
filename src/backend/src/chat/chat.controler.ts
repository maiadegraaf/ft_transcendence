import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { Message } from './entities/message.entity';
import { MessageService } from './services/message.service';
import { ChannelService } from './services/channel.service';
import { UserService } from '../user/services/user/user.service';
// import { User } from '../user/entities/user.entity';
// import { AppService } from './app.service';

@Controller('chat')
export class ChatController {
  // constructor(private readonly appService: AppService) {}
  constructor(
    private readonly channelService: ChannelService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  // Get /api/chat/${id}
  @Get('/:id')
  async getChannelMessages(@Param('id') id: number): Promise<any> {
    return await this.channelService.getMessagesFromChannel(id);
    // return this.messageService.getMessagesByChannelID(id);
  }

  // Get /api/chat/${id}/channel
  @Get('/:id/channel')
  async getUserChannels(@Param('id') id: number): Promise<any> {
    console.log('this is the right id: ' + id);
    return await this.userService.getChannelsByUserId(id);
    // return await this.channelService.getChannelsByUserId(id);
  }

  // Post /api/chat/dm
  @Post('dm')
  async postNewChannel(
    @Body() param: { user1: number; user2: number },
  ): Promise<any> {
    const channel = await this.channelService.newDmChannel(
      param.user1,
      param.user2,
    );
    console.log(channel);
    return channel;
  }

  // Post /api/chat/group
  @Post('group')
  postNewGroupChannel(param: {
    ownerId: number;
    groupName: string;
  }): Promise<any> {
    return this.channelService.newGroupChannel(param.ownerId, param.groupName);
  }

  // Post /api/chat/group/userAdd
  @Post('group/userAdd')
  async postUserToChannel(param: {
    channelId: number;
    userId: number;
  }): Promise<any> {
    const channel = await this.channelService.getChannelById(param.channelId);
    return this.channelService.addUserToChannel(channel, param.userId);
  }
}
