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
// import { UserModule } from '../users/users.module';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/services/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Channel, GroupProfile, User])],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    MessageService,
    ChannelService,
    GroupProfileService,
    UsersService,
  ],
})
export class ChatModule {}
