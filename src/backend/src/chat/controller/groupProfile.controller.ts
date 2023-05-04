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

    // Post /api/chat/group/user
    @Post('user')
    async postNewUserToChannel(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ): Promise<any> {
        try {
            console.log('postNewUserToChannel' + JSON.stringify(param));
            const user = await this.userService.getUserByLogin(param.userName);
            if (!user) {
                throw new HttpException(
                    'Could not find user to add to group channel',
                    HttpStatus.FORBIDDEN,
                );
            }
            if (
                await this.groupProfileService.isBlocked(user.id, param.groupId)
            ) {
                throw new HttpException(
                    'User is banned from group',
                    HttpStatus.FORBIDDEN,
                );
            }
            const channel = await this.channelService.addUserToChannel(
                param.channelId,
                user,
            );
            await this.chatGateway.emitGroupChannelToUser(channel, user);
        } catch (error) {
            this.logger.error('postNewUserToChannel: ' + error);
        }
    }

    // Delete /api/chat/group/user
    @Delete('user')
    async deleteUserFromChannel(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ): Promise<any> {
        try {
            const user = await this.userService.getUserByLogin(param.userName);
            if (!user) {
                throw new HttpException(
                    'Could not find user to add to group channel',
                    HttpStatus.FORBIDDEN,
                );
            }
            console.log(JSON.stringify(user));
            const channel = await this.channelService.removeUserFromChannel(
                param.channelId,
                user,
            );
            await this.chatGateway.emitDeleteChannelFromUser(channel, user);
            // emit something to user to remove channel from list (maybe update emit)
        } catch (error) {
            this.logger.error('deleteUserFromChannel: ' + error);
        }
    }

    // Post /api/chat/group/admin
    @Post('admin')
    async postAdminToGroup(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ) {
        try {
            const info = await this.groupProfileService.addAdmin(param);
            await this.chatGateway.emitRemoveAdminFromChannel(info);
            this.logger.log('postAdminToGroup: ' + param.userName);
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
            const info = await this.groupProfileService.deleteAdmin(param);
            await this.chatGateway.emitAddAdminToChannel(info);
            this.logger.log('deleteAdminFromGroup: ' + param.userName);
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
            const info = await this.groupProfileService.addMute(param);
            await this.chatGateway.emitAddMutedToChannelToUser(info);
            this.logger.log('postMutedToGroup: ' + param.userName);
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
            const info = await this.groupProfileService.deleteMute(param);
            await this.chatGateway.emitRemoveMutedFromChannelToUser(info);
            this.logger.log('deleteMutedFromGroup: ' + param.userName);
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
            const user = await this.groupProfileService.addBlocked(param);
            const channel = await this.channelService.removeUserFromChannel(
                param.channelId,
                user,
            );
            await this.chatGateway.emitDeleteChannelFromUser(channel, user);
            this.logger.log('postBlockedToGroup: ' + param.userName);
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
            this.logger.log('deleteBlockedFromGroup: ' + param.userName);
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }
}
