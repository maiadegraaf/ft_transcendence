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
    Req,
    UseGuards,
} from '@nestjs/common';
import { Channel } from '../entities/channel.entity';
import { MessageService } from '../services/message.service';
import { ChannelService } from '../services/channel.service';
import { UserService } from '../../user/services/user/user.service';
import { CreateDmChannelDto, CreateGroupChannelDto } from '../dtos/chat.dtos';
import { ChatGateway } from '../gateway/chat.gateway';
import { GroupProfileService } from '../services/groupProfile.service';
import { FortyTwoAuthGuard } from '../../auth/auth.guard';
import {response} from "express";

@Controller('chat')
export class ChatController {
    constructor(
        private readonly channelService: ChannelService,
        private readonly messageService: MessageService,
        private readonly userService: UserService,
        private readonly chatGateway: ChatGateway,
        private readonly groupProfileService: GroupProfileService,
    ) {}

    private logger = new Logger('ChatController');

    // Get /api/chat/
    @UseGuards(FortyTwoAuthGuard)
    @Get('/')
    async getUserChannels(@Req() req): Promise<Channel[]> {
        const id = req.session.user.id;
        this.logger.log('getChannelMessages: messages found for user: ' + id);
        const channels = await this.channelService.getUserChannels(id);
        return channels;
    }

    // Get /api/chat/${id}/channel
    @UseGuards(FortyTwoAuthGuard)
    @Get('/:id/channel')
    async getUserChannel(@Req() req): Promise<any> {
        const id = req.session.user.id;
        const channels = await this.userService.getChannelsByUserId(id);
        if (!channels) {
            this.logger.error(
                'getUserChannels: No channels found from user: ' + id,
            );
            return;
        }
        this.logger.log('getUserChannels: channels found from user: ' + id);
        return channels;
    }

    // Post /api/chat/dm
    @UseGuards(FortyTwoAuthGuard)
    @Post('dm')
    async postNewDMChannel(
        @Req() req,
        @Body(new ValidationPipe()) param: CreateDmChannelDto,
    ): Promise<any> {
        // try {
            const id = req.session.user.id;
            const user1 = await this.userService.getUserById(id);
            if (!user1) {
                throw new HttpException(
                    'Could not find user1 by id to create new dm channel',
                    HttpStatus.FORBIDDEN,
                );
            }
            const user2 = await this.userService.getUserByLogin(param.invitee);
            if (!user2) {
                throw new HttpException(
                    'Could not find user2 by invitee to create new dm channel',
                    HttpStatus.FORBIDDEN,
                );
            }
            let channel = await this.channelService.newDmChannel(user1, user2);
            channel = await this.channelService.getChannelById(channel.id);
            await this.chatGateway.emitNewDmChannel(user1, user2, channel);
            return;
        // } catch (error) {
        //     this.logger.error('postNewDMChannel: ' + error);
        // }
    }

    // Post /api/chat/group
    @UseGuards(FortyTwoAuthGuard)
    @Post('group')
    async postNewGroupChannel(
        @Req() req,
        @Body(new ValidationPipe()) param: CreateGroupChannelDto,
    ): Promise<any> {
        try {
            const id = req.session.user.id;
            await this.groupProfileService.checkValidGroupName(param.groupName);
            const owner = await this.userService.getUserById(id);
            if (!owner) {
                throw new HttpException(
                    'Could not find user to create new group channel',
                    HttpStatus.FORBIDDEN,
                );
            }
            let channel = await this.channelService.newGroupChannel(
                owner,
                param.groupName,
                param.type,
                param.password,
            );
            if (!channel) {
                throw new HttpException(
                    'Could not create new group channel',
                    HttpStatus.FORBIDDEN,
                );
            }
            channel = await this.channelService.getChannelById(channel.id);
            await this.chatGateway.emitGroupChannelToUser(channel, owner);
            return;
        } catch (error) {
            this.logger.error('postNewGroupChannel: ' + error);
        }
    }
}
