import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Logger,
    ValidationPipe,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Channel } from './entities/channel.entity';
import { MessageService } from './services/message.service';
import { ChannelService } from './services/channel.service';
import { UserService } from '../user/services/user/user.service';
import { CreateDmChannelDto, CreateGroupChannelDto } from './dtos/chat.dtos';
import { ChatGateway } from './gateway/chat.gateway';
import { validatePath } from '@nestjs/serve-static/dist/utils/validate-path.util';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly channelService: ChannelService,
        private readonly messageService: MessageService,
        private readonly userService: UserService,
        private readonly chatGateway: ChatGateway,
    ) {}

    private logger = new Logger('ChatController');

    // Get /api/chat/${id}
    @Get('/:id')
    async getUserChannels(@Param('id') id: number): Promise<Channel[]> {
        this.logger.log(
            'getChannelMessages: messages found from channel: ' + id,
        );
        return this.channelService.getUserChannels(id);
    }

    // Get /api/chat/${id}/channel
    @Get('/:id/channel')
    async getUserChannel(@Param('id') userId: number): Promise<any> {
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
        try {
            console.log('param: ' + JSON.stringify(param));
            const user1 = await this.userService.getUserById(param.userId);
            if (!user1) {
                throw new HttpException(
                    'Could not find user1 by id to create new dm channel',
                    HttpStatus.FORBIDDEN,
                );
            }
            // console.log('user1: ' + JSON.stringify(user1));
            // if (
            //     !(await this.channelService.allowedNewDmChannel(
            //         user1,
            //         param.invitee,
            //     ))
            // ) {
            //     throw new HttpException(
            //         'invitee not allowed to create new dm channel',
            //         HttpStatus.FORBIDDEN,
            //     );
            // }
            console.log('invitee allowed to create new dm channel');
            const user2 = await this.userService.getUserByLogin(param.invitee);
            if (!user2) {
                throw new HttpException(
                    'Could not find user2 by invitee to create new dm channel',
                    HttpStatus.FORBIDDEN,
                );
            }
            const channel = await this.channelService.newDmChannel(
                user1,
                user2,
            );
            console.log('channel: ' + JSON.stringify(channel));
            await this.chatGateway.emitNewDmChannel(user1, user2, channel);
            return;
        } catch (error) {
            this.logger.error('postNewDMChannel: ' + error);
        }
    }

    // Post /api/chat/group
    @Post('group')
    async postNewGroupChannel(
        @Body(new ValidationPipe()) param: CreateGroupChannelDto,
    ): Promise<any> {
        try {
            console.log('param: ' + JSON.stringify(param));
            const owner = await this.userService.getUserById(param.userId);
            console.log('owner: ' + JSON.stringify(owner));
            if (!owner) {
                throw new HttpException(
                    'Could not find user to create new group channel',
                    HttpStatus.FORBIDDEN,
                );
            }
            const channel = await this.channelService.newGroupChannel(
                owner,
                param.groupName,
            );
            if (!channel) {
                throw new HttpException(
                    'Could not create new group channel',
                    HttpStatus.FORBIDDEN,
                );
            }
            console.log('channel: ' + JSON.stringify(channel));
            await this.chatGateway.emitGroupChannelToUser(channel, owner);
            return;
        } catch (error) {
            this.logger.error('postNewGroupChannel: ' + error);
        }
    }
}
