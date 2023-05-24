import {
    Body,
    Controller,
    Delete,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    ValidationPipe,
    UseGuards,
    Req
} from '@nestjs/common'
import { ChannelService } from '../services/channel.service'
import { UserService } from '../../user/services/user/user.service'
import { ChatGateway } from '../gateway/chat.gateway'
import {
    EGroupChannelType,
    GroupUserProfileUpdateDto,
    JoinGroupDto,
    JoinGroupProtectedDto
} from '../dtos/chat.dtos'
import { GroupProfileService } from '../services/groupProfile.service'
import { FortyTwoAuthGuard } from '../../auth/auth.guard'

@Controller('chat/group')
export class GroupProfileController {
    constructor(
        private readonly channelService: ChannelService,
        private readonly userService: UserService,
        private readonly chatGateway: ChatGateway,
        private readonly groupProfileService: GroupProfileService
    ) {}

    private logger = new Logger('GroupProfileController')

    // Post /api/chat/group/join
    @UseGuards(FortyTwoAuthGuard)
    @Post('join')
    async postJoinGroup(@Req() req, @Body(new ValidationPipe()) param: JoinGroupDto): Promise<any> {
        // try {
            const id = req.session.user.id
            const user = await this.userService.getUserById(id)
            if (!user) {
                throw new HttpException(
                    'Could not find user to add to group channel',
                    HttpStatus.FORBIDDEN
                )
            }
            const group = await this.groupProfileService.getGroupProfileByName(param.groupName)
            if (await this.groupProfileService.isBlocked(user.id, group.id)) {
                throw new HttpException('User is banned from group', HttpStatus.FORBIDDEN)
            }
            if (group.type == EGroupChannelType.PROTECTED) {
                const payload = {
                    groupId: group.id,
                    type: group.type
                }
                return payload
            }
            const channel = await this.channelService.addUserToChannel(group.channel.id, user)
            await this.chatGateway.emitGroupChannelToUser(channel, user)
            return null
        // } catch (error) {
        //     this.logger.error('postJoinGroup: ' + error)
        // }
    }

    // Post /api/chat/group/user/password
    @UseGuards(FortyTwoAuthGuard)
    @Post('user/password')
    async postUserWithPassword(
        @Req() req,
        @Body(new ValidationPipe()) param: JoinGroupProtectedDto
    ): Promise<any> {
        try {
            const id = req.session.user.id
            const user = await this.userService.getUserById(id)
            if (!user) {
                throw new HttpException(
                    'Could not find user to add to group channel',
                    HttpStatus.FORBIDDEN
                )
            }
            if (await this.groupProfileService.isBlocked(user.id, param.groupId)) {
                throw new HttpException('User is banned from group', HttpStatus.FORBIDDEN)
            }
            const group = await this.groupProfileService.getGroupProfileAndCheckPassword(
                user,
                param.groupId,
                param.password
            )
            const channel = await this.channelService.addUserToChannel(group.channel.id, user)
            await this.chatGateway.emitGroupChannelToUser(channel, user)
            return true
        } catch (error) {
            this.logger.error('postUserWithPassword: ' + error)
            return false
        }
    }

    // Post /api/chat/group/user
    @UseGuards(FortyTwoAuthGuard)
    @Post('user')
    async postNewUserToChannel(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto
    ): Promise<any> {
        try {
            const user = await this.userService.getUserByLogin(param.userName)
            if (!user) {
                throw new HttpException(
                    'Could not find user to add to group channel',
                    HttpStatus.FORBIDDEN
                )
            }
            await this.groupProfileService.userAlreadyInGroup(user.id, param.groupId)
            if (await this.groupProfileService.isBlocked(user.id, param.groupId)) {
                throw new HttpException('User is banned from group', HttpStatus.FORBIDDEN)
            }
            const channel = await this.channelService.addUserToChannel(param.channelId, user)
            await this.chatGateway.emitGroupChannelToUser(channel, user)
        } catch (error) {
            this.logger.error('postNewUserToChannel: ' + error)
        }
    }

    // Delete /api/chat/group/user
    @UseGuards(FortyTwoAuthGuard)
    @Delete('user')
    async deleteUserFromChannel(
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto
    ): Promise<any> {
        try {
            const user = await this.userService.getUserByLogin(param.userName)
            if (!user) {
                throw new HttpException(
                    'Could not find user to add to group channel',
                    HttpStatus.FORBIDDEN
                )
            }
            const channel = await this.channelService.removeUserFromChannel(param.channelId, user)
            await this.chatGateway.emitDeleteChannelFromUser(channel, user)
            // emit something to user to remove channel from list (maybe update emit)
        } catch (error) {
            this.logger.error('deleteUserFromChannel: ' + error)
        }
    }

    // Post /api/chat/group/admin
    @UseGuards(FortyTwoAuthGuard)
    @Post('admin')
    async postAdminToGroup(
        @Req() req,
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto
    ) {
        try {
            const id = req.session.user.id
            const info = await this.groupProfileService.addAdmin(param, id)
            await this.chatGateway.emitAddAdminToChannel(info)
            this.logger.log('postAdminToGroup: ' + param.userName)
        } catch (error) {
            this.logger.error(error)
            return false
        }
    }

    // Delete /api/chat/group/admin
    @UseGuards(FortyTwoAuthGuard)
    @Delete('admin')
    async deleteAdminFromGroup(
        @Req() req,
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto
    ) {
        try {
            const id = req.session.user.id
            const info = await this.groupProfileService.deleteAdmin(param, id)
            await this.chatGateway.emitRemoveAdminFromChannel(info)
            this.logger.log('deleteAdminFromGroup: ' + param.userName)
        } catch (error) {
            this.logger.error(error)
            return false
        }
    }

    // Post /api/chat/group/muted
    @UseGuards(FortyTwoAuthGuard)
    @Post('muted')
    async postMutedToGroup(
        @Req() req,
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto
    ) {
        try {
            const id = req.session.user.id
            const info = await this.groupProfileService.addMute(param, id)
            await this.chatGateway.emitAddMutedToChannelToUser(info)
            this.logger.log('postMutedToGroup: ' + param.userName)
        } catch (error) {
            this.logger.error(error)
            return false
        }
    }

    // Delete /api/chat/group/muted
    @UseGuards(FortyTwoAuthGuard)
    @Delete('muted')
    async deleteMutedFromGroup(
        @Req() req,
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto
    ) {
        try {
            const id = req.session.user.id
            const info = await this.groupProfileService.deleteMute(param, id)
            await this.chatGateway.emitRemoveMutedFromChannelToUser(info)
            this.logger.log('deleteMutedFromGroup: ' + param.userName)
        } catch (error) {
            this.logger.error(error)
            return false
        }
    }

    // Post /api/chat/group/banned
    @UseGuards(FortyTwoAuthGuard)
    @Post('banned')
    async postBlockedToGroup(
        @Req() req,
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto
    ) {
        try {
            const id = req.session.user.id
            const user = await this.groupProfileService.addBlocked(param, id)
            const channel = await this.channelService.removeUserFromChannel(param.channelId, user)
            await this.chatGateway.emitDeleteChannelFromUser(channel, user)
            this.logger.log('postBlockedToGroup: ' + param.userName)
        } catch (error) {
            this.logger.error(error)
            return false
        }
    }

    // Post /api/chat/group/banned
    @UseGuards(FortyTwoAuthGuard)
    @Delete('banned')
    async deleteBlockedFromGroup(
        @Req() req,
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto
    ) {
        try {
            const id = req.session.user.id
            await this.groupProfileService.deleteBlocked(param, id)
            this.logger.log('deleteBlockedFromGroup: ' + param.userName)
        } catch (error) {
            this.logger.error(error)
            return false
        }
    }

    // Delete /api/chat/group
    @UseGuards(FortyTwoAuthGuard)
    @Delete()
    async deleteGroup(@Req() req, @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto) {
        try {
            const id = req.session.user.id
            let group = await this.groupProfileService.ownerCheck(param, id)
            if (!group.channel) {
                throw new HttpException('Could not find channel to delete', HttpStatus.FORBIDDEN)
            }
            let channel = group.channel
            group = await this.groupProfileService.nullifyChannel(group)
            channel = await this.channelService.nullifyProfile(channel)
            const users = channel.users
            for (const user of users) {
                try {
                    await this.chatGateway.emitDeleteChannelFromUser(channel, user)
                } catch (error) {
                    this.logger.error(error)
                }
            }
            await this.groupProfileService.deleteGroup(group)
            await this.channelService.deleteChannel(channel)
            this.logger.log('deleteGroup: ' + param.groupId)
            return true
        } catch (error) {
            this.logger.error(error)
            return false
        }
    }

    // Delete /api/chat/group/leave
    @UseGuards(FortyTwoAuthGuard)
    @Delete('leave')
    async deleteLeaveGroup(
        @Req() req,
        @Body(new ValidationPipe()) param: GroupUserProfileUpdateDto
    ) {
        try {
            const id = req.session.user.id
            let group = await this.groupProfileService.getGroupProfileById(param.groupId)
            const user = group.channel.users.find((user) => user.id === id)
            if (!user) {
                throw new HttpException(
                    'Could not find user to remove from channel',
                    HttpStatus.FORBIDDEN
                )
            }
            let channel = group.channel
            if (group.owner.id == id) {
                if (!(await this.groupProfileService.reassignOwner(group, id))) {
                    group = await this.groupProfileService.nullifyChannel(group)
                    channel = await this.channelService.nullifyProfile(channel)
                    await this.groupProfileService.deleteGroup(group)
                    await this.chatGateway.emitDeleteChannelFromUser(channel, user)
                    await this.channelService.deleteChannel(channel)
                    return true
                }
            }
            await this.groupProfileService.removeRoles(group, id)
            channel = await this.channelService.removeUserFromChannel(group.channel.id, user)
            await this.chatGateway.emitDeleteChannelFromUser(channel, user)
            return true
        } catch (error) {
            this.logger.error(error)
            return false
        }
    }
}
