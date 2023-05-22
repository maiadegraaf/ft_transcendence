import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { MessageService } from './services/message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Channel } from './entities/channel.entity';
import { ChatController } from './controller/chat.controler';
import { ChannelService } from './services/channel.service';
import { GroupProfile } from './entities/groupProfile.entity';
import { GroupProfileService } from './services/groupProfile.service';
import { UserService } from '../user/services/user/user.service';
import { User } from 'src/user/user.entity';
import { Avatar } from 'src/user/avatar.entity';
import { AvatarService } from 'src/user/services/user/avatar.service';
import { GroupProfileController } from './controller/groupProfile.controller';
import { GroupProfileGateway } from './gateway/group-profile.gateway';
import { MutedTime } from './entities/mutedTime.enitity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Message,
            Channel,
            GroupProfile,
            User,
            Avatar,
            MutedTime,
        ]),
    ],
    controllers: [ChatController, GroupProfileController],
    providers: [
        MessageService,
        ChannelService,
        GroupProfileService,
        UserService,
        ChatGateway,
        AvatarService,
        GroupProfileGateway,
    ],
})
export class ChatModule {}
