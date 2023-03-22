import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { MessageService } from './services/message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { DmChannel } from './entities/dmChannel.entity';
import { GroupChannel } from './entities/groupChannel.entity';
import { Channel } from './entities/channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, DmChannel, GroupChannel, Channel]),
  ],
  controllers: [],
  providers: [ChatGateway, MessageService],
})
export class ChatModule {}
