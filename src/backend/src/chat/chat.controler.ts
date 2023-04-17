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
import { ChatGateway } from './gateway/chat.gateway';
// import { User } from '../user/entities/user.entity';
// import { AppService } from './app.service';

@Controller('chat')
export class ChatController {
    // constructor(private readonly appService: AppService) {}
    constructor(
        private readonly channelService: ChannelService,
        private readonly messageService: MessageService,
        private readonly userService: UserService,
        private readonly chatGateway: ChatGateway,
    ) {}

    private logger = new Logger('ChatController');

    // Get /api/chat/${id}
    @Get('/:id')
    async getChannelMessages(@Param('id') id: number): Promise<any> {
        this.logger.log(
            'getChannelMessages: messages found from channel: ' + id,
        );
        return this.channelService.getUserChannelDTO(id);
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

    // Get /api/chat/channel/${id}
    @Get('/channel/:id')
    async getChannelById(@Param('id') channelId: number): Promise<any> {
        const channel = await this.channelService.getChannelById(channelId);
        if (!channel) {
            this.logger.error(
                'getChannelById: No channel found from id: ' + channelId,
            );
            return;
        }
        const channelDto = await this.channelService.channelDTO(channel);
        this.logger.log('getChannelById: channel found from id: ' + channelId);
        return channelDto;
    }

    // Post /api/chat/dm
    @Post('dm')
    async postNewDMChannel(
        @Body(new ValidationPipe()) param: CreateDmChannelDto,
    ): Promise<any> {
        console.log(
            'this is param from postNewDmChannel :' + JSON.stringify(param),
        );
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
        const newUserJoinRoomDto = await this.channelService.newJoinRoomDto(
            channel,
            user2,
        );
        // console.log(
        //     'this is newUserJoinRoomDto :' + JSON.stringify(newUserJoinRoomDto),
        // );
        const dmClient = this.chatGateway.getClientSocketById(user2.id);
        if (dmClient) {
            console.log('this is dmCLien :' + dmClient.id);
            dmClient.emit('newUserToChannel', newUserJoinRoomDto);
        }
        const newChannelDto = this.channelService.newChannelDTO(channel);
        // console.log('this is newChannelDto :' + JSON.stringify(newChannelDto));
        return newChannelDto;
    }
}
