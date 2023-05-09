import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { UserService } from '../../user/services/user/user.service';
import { GroupProfile } from '../entities/groupProfile.entity';
import { User } from '../../user/user.entity';
import { GroupUserProfileUpdateDto } from '../dtos/chat.dtos';

@Injectable()
export class GroupProfileService {
    constructor(
        @InjectRepository(GroupProfile)
        private readonly groupProfileRepository: Repository<GroupProfile>,
        private readonly userService: UserService,
    ) {}

    async createGroupProfile(): Promise<any> {
        const groupProfile = new GroupProfile();
        return await this.groupProfileRepository.save(groupProfile);
    }

    async newGroupProfile(owner: User, groupName: string, channel: Channel) {
        const groupProfile = await this.createGroupProfile();
        if (!groupProfile) {
            throw new HttpException(
                'could not create group profile',
                HttpStatus.FORBIDDEN,
            );
            return;
        }
        groupProfile.channel = channel;
        groupProfile.admin = [];
        groupProfile.admin.push(owner);
        groupProfile.blocked = [];
        groupProfile.muted = [];
        groupProfile.name = groupName;
        groupProfile.owner = owner;
        return await this.groupProfileRepository.save(groupProfile);
    }

    async addAdmin(param: GroupUserProfileUpdateDto): Promise<any> {
        const group = await this.ownerCheck(param);
        const user = await this.userGroupProfileCheck(group, param);
        if (group.admin.find((admin) => admin.id === user.id)) {
            throw new HttpException('user already admin', HttpStatus.FORBIDDEN);
        }
        group.admin.push(user);
        const info = {
            channelId: group.channel.id,
            user: {
                id: user.id,
                login: user.login,
            },
        };
        await this.groupProfileRepository.save(group);
        return info;
    }

    async addBlocked(param: GroupUserProfileUpdateDto): Promise<any> {
        const group = await this.adminCheck(param, 'blocked');
        const user = await this.userGroupProfileCheck(group, param);
        group.blocked.push(user);
        await this.groupProfileRepository.save(group);
        return user;
    }

    async addMute(param: GroupUserProfileUpdateDto): Promise<any> {
        const group = await this.adminCheck(param, 'muted');
        const user = await this.userGroupProfileCheck(group, param);
        group.muted.push(user);
        const info = {
            channelId: group.channel.id,
            user: {
                id: user.id,
                login: user.login,
            },
        };
        await this.groupProfileRepository.save(group);
        return info;
    }

    async deleteAdmin(param: GroupUserProfileUpdateDto): Promise<any> {
        const group = await this.ownerCheck(param);
        const user = await this.userGroupProfileCheck(group, param);
        const idx = group.admin.findIndex((admin) => admin.id === user.id);
        if (idx === -1) {
            throw new HttpException(
                'admin not in group to delete',
                HttpStatus.FORBIDDEN,
            );
        }
        group.admin.splice(idx, 1);
        const info = {
            channelId: group.channel.id,
            user: {
                id: user.id,
                login: user.login,
            },
        };
        await this.groupProfileRepository.save(group);
        return info;
    }

    async deleteBlocked(param: GroupUserProfileUpdateDto): Promise<any> {
        const group = await this.adminCheck(param, 'blocked');
        const user = await this.userGroupProfileCheck(group, param);
        const idx = group.blocked.findIndex(
            (blocked) => blocked.id === user.id,
        );
        if (idx === -1) {
            throw new HttpException(
                'admin not in group to delete',
                HttpStatus.FORBIDDEN,
            );
        }
        group.blocked.splice(idx, 1);
        return await this.groupProfileRepository.save(group);
    }

    async deleteMute(param: GroupUserProfileUpdateDto): Promise<any> {
        const group = await this.adminCheck(param, 'muted');
        const user = await this.userGroupProfileCheck(group, param);
        const idx = group.muted.findIndex((muted) => muted.id === user.id);
        if (idx === -1) {
            throw new HttpException(
                'admin not in group to delete',
                HttpStatus.FORBIDDEN,
            );
        }
        group.muted.splice(idx, 1);
        const info = {
            channelId: group.channel.id,
            user: {
                id: user.id,
                login: user.login,
            },
        };
        await this.groupProfileRepository.save(group);
        return info;
    }

    async ownerCheck(param: GroupUserProfileUpdateDto): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .where('group.id = :id', { id: param.groupId })
            .leftJoinAndSelect('group.owner', 'owner')
            .leftJoinAndSelect('group.admin', 'admin')
            .leftJoinAndSelect('group.channel', 'channel')
            .leftJoinAndSelect('channel.users', 'users')
            .getOne();
        if (!group) {
            throw new HttpException(
                'could not find group due to wrong id',
                HttpStatus.FORBIDDEN,
            );
        }
        if (group.owner.id !== param.userId) {
            throw new HttpException(
                'user is not owner of group',
                HttpStatus.FORBIDDEN,
            );
        }
        return group;
    }

    async userGroupProfileCheck(
        group: GroupProfile,
        param: GroupUserProfileUpdateDto,
    ): Promise<any> {
        const user = group.channel.users.find(
            (usr) => usr.login === param.userName,
        );
        if (!user) {
            throw new HttpException(
                'could not find user to add to admin',
                HttpStatus.FORBIDDEN,
            );
        }
        return user;
    }

    async adminCheck(
        param: GroupUserProfileUpdateDto,
        type: string,
    ): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .where('group.id = :id', { id: param.groupId })
            .leftJoinAndSelect('group.admin', 'admin')
            .leftJoinAndSelect('group.' + type, type)
            .leftJoinAndSelect('group.channel', 'channel')
            .leftJoinAndSelect('channel.users', 'users')
            .getOne();
        if (!group) {
            throw new HttpException(
                'could not find group in adminCheck for ' + type,
                HttpStatus.FORBIDDEN,
            );
        }
        if (!group.admin.find((admin) => admin.id === param.userId)) {
            throw new HttpException(
                'user is not an admin in group',
                HttpStatus.FORBIDDEN,
            );
        }
        return group;
    }

    async isBlocked(userId: number, groupId: number): Promise<boolean> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .where('group.id = :id', { id: groupId })
            .leftJoinAndSelect('group.blocked', 'blocked')
            .getOne();
        if (!group) {
            throw new HttpException(
                'could not find group in isBlocked',
                HttpStatus.FORBIDDEN,
            );
        }
        if (group.blocked.find((blocked) => blocked.id === userId)) {
            return true;
        }
        return false;
    }

    async deleteGroup(param: GroupUserProfileUpdateDto): Promise<any> {
        const group = await this.ownerCheck(param);
        const channel = group.channel;
        await this.groupProfileRepository.remove(group);
        return channel;
    }
}
