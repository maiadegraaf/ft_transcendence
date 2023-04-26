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

    @Post('admin')
    async postAdminToGroup(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ) {
        try {
            console.log('param: ' + JSON.stringify(param));
            const user = await this.userService.getUserByLogin(param.userName);
            if (!user) {
                throw new HttpException(
                    'User not found in GroupProfileController',
                    HttpStatus.NOT_FOUND,
                );
            }
            await this.groupProfileService.addAdmin(param.groupId, user);
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Delete('admin')
    async deleteAdminFromGroup(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ) {
        try {
            const user = await this.userService.getUserByLogin(param.userName);
            if (!user) {
                throw new HttpException(
                    'User not found in GroupProfileController',
                    HttpStatus.NOT_FOUND,
                );
            }
            await this.groupProfileService.deleteAdmin(param.groupId, user);
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Post('muted')
    async postMutedToGroup(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ) {
        try {
            const user = await this.userService.getUserByLogin(param.userName);
            if (!user) {
                throw new HttpException(
                    'User not found in GroupProfileController',
                    HttpStatus.NOT_FOUND,
                );
            }
            await this.groupProfileService.addMute(user, param.groupId);
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Delete('muted')
    async deleteMutedFromGroup(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ) {
        try {
            const user = await this.userService.getUserByLogin(param.userName);
            if (!user) {
                throw new HttpException(
                    'User not found in GroupProfileController',
                    HttpStatus.NOT_FOUND,
                );
            }
            await this.groupProfileService.deleteMute(user, param.groupId);
        } catch (error) {}
    }

    @Post('banned')
    async postBlockedToGroup(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ) {
        try {
            const user = await this.userService.getUserByLogin(param.userName);
            if (!user) {
                throw new HttpException(
                    'User not found in GroupProfileController',
                    HttpStatus.NOT_FOUND,
                );
            }
            await this.groupProfileService.addBlocked(user, param.groupId);
        } catch (error) {}
    }

    @Delete('banned')
    async deleteBlockedFromGroup(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto,
    ) {
        try {
            const user = await this.userService.getUserByLogin(param.userName);
            if (!user) {
                throw new HttpException(
                    'User not found in GroupProfileController',
                    HttpStatus.NOT_FOUND,
                );
            }
            await this.groupProfileService.deleteBlocked(user, param.groupId);
        } catch (error) {}
    }
}
