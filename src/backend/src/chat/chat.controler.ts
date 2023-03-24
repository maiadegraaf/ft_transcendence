import { Controller, Get, Post, Param } from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { Message } from './entities/message.entity';
import { MessageService } from './services/message.service';
import { ChannelService } from './services/channel.service';
import { User } from "../user/entities/user.entity";


// import { AppService } from './app.service';

@Controller('chat')
export class ChatController {
  // constructor(private readonly appService: AppService) {}
  constructor(
    private readonly channelService: ChannelService,
    private readonly messageService: MessageService,
  ) {}

  // @Get('channel/:id')
  // getChannel(@Param(':id') id: number): Promise<Channel> {
  //   return this.channelService.getChannel(id);
  // }

  // Get /api/chat/id
  @Get('/:id')
  getChannelMessages(@Param('id') id: number): Promise<Message[]> {
    return this.messageService.getMessagesByChannelID(id);
  }

  // @Post('dm')
  // postNewChannel(options: {
  //   user1: number,
  //   user2: number
  // }): void {
  //   this.channelService.createChannel();
  // }
}
