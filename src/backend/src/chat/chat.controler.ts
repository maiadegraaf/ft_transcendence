import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Logger,
    ValidationPipe,
} from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { Message } from './entities/message.entity';
import { MessageService } from './services/message.service';
import { ChannelService } from './services/channel.service';
import { UserService } from '../user/services/user/user.service';
import { CreateDmChannelDto } from './dtos/chat.dtos';
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

    private logger = new Logger('ChatController');

    // Get /api/chat/${id}
    @Get('/:id')
    async getChannelMessages(@Param('id') id: number): Promise<any> {
        // console.log(id);
        // const messages = await this.channelService.getMessagesFromChannel(id);
        // this.logger.log('getChannelMessages: messages found from channel: ' + id);
        // return messages;
        this.logger.log(
            'getChannelMessages: messages found from channel: ' + id,
        );
        return this.channelService.getUserChannelDTO(id);
        // return this.messageService.getMessagesByChannelID(id);
    }

    // Get /api/chat/${id}/channel
    @Get('/:id/channel')
    async getUserChannels(@Param('id') userId: number): Promise<any> {
        const channels = await this.userService.getChannelsByUserId(userId);
        if (!channels) {
            this.logger.error(
                'getUserChannels: No channels found from user: ' + userId,
            );
            return;
        }
        this.logger.log('getUserChannels: channels found from user: ' + userId);
        return channels;
    }

    // Post /api/chat/dm
    @Post('dm')
    async postNewDMChannel(
        @Body(new ValidationPipe()) param: CreateDmChannelDto,
    ): Promise<any> {
        const user2 = await this.userService.getUserByLogin(param.invitee);
        if (!user2) {
            this.logger.error(
                'postNewDMChannel: no user found for name: ' +
                    JSON.stringify(param),
            );
            return;
        }
        const channel = await this.channelService.newDmChannel(
            param.userId,
            user2.id,
        );
        if (!channel) {
            this.logger.error(
                'postNewDMChannel: no new dm channel for users: ' +
                    param.userId +
                    ' & ' +
                    param.invitee,
            );
            return;
        }
        this.logger.log(
            'postNewDMChannel: new dm channel for users: ' +
                param.userId +
                ' & ' +
                param.invitee,
        );
        const channelDto = await this.channelService.newChannelDTO(channel.id);
        return channelDto;
    }

    // // Post /api/chat/group
    // @Post('group')
    // postNewGroupChannel(param: {
    //   ownerId: number;
    //   groupName: string;
    // }): Promise<any> {
    //   return this.channelService.newGroupChannel(param.ownerId, param.groupName);
    // }

    // // Post /api/chat/group/userAdd
    // @Post('group/userAdd')
    // async postUserToChannel(param: {
    //   channelId: number;
    //   userId: number;
    // }): Promise<any> {
    //   const channel = await this.channelService.getChannelById(param.channelId);
    //   return this.userService.addChannelToUser(channel, param.userId);
    // }
}
