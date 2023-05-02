import {
    Body,
    Controller,
    Delete,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { ChannelService } from '../services/channel.service';
import { UserService } from '../../user/services/user/user.service';
import { ChatGateway } from '../gateway/chat.gateway';
import { GroupUserProfileUpdateDto } from '../dtos/chat.dtos';
import { GroupProfileService } from '../services/groupProfile.service';

@Controller('chat/group')
export class GroupProfileController {
    constructor(
        private readonly channelService: ChannelService,
        private readonly userService: UserService,
        private readonly chatGateway: ChatGateway,
        private readonly groupProfileService: GroupProfileService,
    ) {}

    private logger = new Logger('GroupProfileController');

    // Post /api/chat/group/admin
    @Post('admin')
    async postAdminToGroup(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ) {
        try {
            await this.groupProfileService.addAdmin(param);
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    // Delete /api/chat/group/admin
    @Delete('admin')
    async deleteAdminFromGroup(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ) {
        try {
            await this.groupProfileService.deleteAdmin(param);
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    // Post /api/chat/group/muted
    @Post('muted')
    async postMutedToGroup(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ) {
        try {
            await this.groupProfileService.addMute(param);
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    // Delete /api/chat/group/muted
    @Delete('muted')
    async deleteMutedFromGroup(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ) {
        try {
            await this.groupProfileService.deleteMute(param);
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    // Post /api/chat/group/banned
    @Post('banned')
    async postBlockedToGroup(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ) {
        try {
            await this.groupProfileService.addBlocked(param);
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    // Post /api/chat/group/banned
    @Delete('banned')
    async deleteBlockedFromGroup(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ) {
        try {
            await this.groupProfileService.deleteBlocked(param);
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }
}
