import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { MessageService } from './services/message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Channel } from './entities/channel.entity';
import { ChatController } from './chat.controler';
import { ChannelService } from './services/channel.service';
import { GroupProfile } from './entities/groupProfile.entity';
import { GroupProfileService } from './services/groupProfile.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Channel, GroupProfile])],
  controllers: [ChatController],
  providers: [ChatGateway, MessageService, ChannelService, GroupProfileService],
})
export class ChatModule {}
