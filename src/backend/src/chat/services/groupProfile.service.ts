import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { GroupProfile } from '../entities/groupProfile.entity';
import { User } from '../../user/user.entity';
import {
    EGroupChannelType,
    GroupUserProfileUpdateDto,
} from '../dtos/chat.dtos';
import * as bcrypt from 'bcryptjs';
import { MutedTime } from '../entities/mutedTime.enitity';

@Injectable()
export class GroupProfileService {
    constructor(
        @InjectRepository(GroupProfile)
        private readonly groupProfileRepository: Repository<GroupProfile>,
        @InjectRepository(MutedTime)
        private readonly mutedTimeRepository: Repository<MutedTime>,
    ) {}

    async createGroupProfile(): Promise<any> {
        const groupProfile = new GroupProfile();
        return await this.groupProfileRepository.save(groupProfile);
    }

    async newGroupProfile(
        owner: User,
        groupName: string,
        channel: Channel,
        type: EGroupChannelType,
        password?: string,
    ): Promise<any> {
        let groupProfile = await this.createGroupProfile();
        if (!groupProfile) {
            throw new HttpException(
                'could not create group profile',
                HttpStatus.FORBIDDEN,
            );
            return;
        }
        if (password && type == EGroupChannelType.PROTECTED) {
            groupProfile = await this.newPassword(groupProfile, password);
        }
        groupProfile.channel = channel;
        groupProfile.admin = [];
        groupProfile.admin.push(owner);
        groupProfile.blocked = [];
        groupProfile.muted = [];
        groupProfile.name = groupName;
        groupProfile.owner = owner;
        groupProfile.type = type;
        return await this.groupProfileRepository.save(groupProfile);
    }

    async getGroupProfileById(groupId: number): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .where('group.id = :id', { id: groupId })
            .leftJoin('group.owner', 'owner')
            .addSelect('owner.id')
            .leftJoinAndSelect('group.channel', 'channel')
            .leftJoinAndSelect('group.admin', 'admin')
            .leftJoinAndSelect('group.blocked', 'blocked')
            .leftJoinAndSelect('group.muted', 'muted')
            .leftJoinAndSelect('channel.users', 'users')
            .getOne();
        console.log('test');
        if (!group) {
            throw new NotFoundException('group profile not found');
        }
        return group;
    }

    async addAdmin(
        param: GroupUserProfileUpdateDto,
        userId: number,
    ): Promise<any> {
        const group = await this.ownerCheck(param, userId);
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

    async addBlocked(
        param: GroupUserProfileUpdateDto,
        userId: number,
    ): Promise<any> {
        const group = await this.adminCheck(param, 'blocked', userId);
        const user = await this.userGroupProfileCheck(group, param);
        group.blocked.push(user);
        await this.groupProfileRepository.save(group);
        return user;
    }

    async addMute(
        param: GroupUserProfileUpdateDto,
        userId: number,
    ): Promise<any> {
        const group = await this.adminCheck(param, 'muted', userId);
        const user = await this.userGroupProfileCheck(group, param);
        group.muted.push(user);
        const info = {
            channelId: group.channel.id,
            user: {
                id: user.id,
                login: user.login,
            },
        };
        const mt = await this.addMutedTime(user, group);
        group.mutedTime = [];
        group.mutedTime.push(mt);
        await this.groupProfileRepository.save(group);
        return info;
    }

    async deleteAdmin(
        param: GroupUserProfileUpdateDto,
        userId: number,
    ): Promise<any> {
        const group = await this.ownerCheck(param, userId);
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

    async deleteBlocked(
        param: GroupUserProfileUpdateDto,
        userId: number,
    ): Promise<any> {
        const group = await this.adminCheck(param, 'blocked', userId);
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

    async deleteMute(
        param: GroupUserProfileUpdateDto,
        userId: number,
    ): Promise<any> {
        const group = await this.adminCheck(param, 'muted', userId);
        const user = await this.userGroupProfileCheck(group, param);
        await this.removeMute(group, user);
        const info = {
            channelId: group.channel.id,
            user: {
                id: user.id,
                login: user.login,
            },
        };
        return info;
    }

    async removeMute(group: GroupProfile, user: User) {
        await this.removeMutedTime(user, group);
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
        group.muted.splice(idx, 1);
        await this.groupProfileRepository.save(group);
    }

    async ownerCheck(
        param: GroupUserProfileUpdateDto,
        userId: number,
    ): Promise<any> {
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
        if (group.owner.id !== userId) {
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
        userId: number,
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
        if (!group.admin.find((admin) => admin.id === userId)) {
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

    async deleteGroup(group: GroupProfile): Promise<any> {
        await this.groupProfileRepository.remove(group);
    }

    async nullifyChannel(group: GroupProfile): Promise<any> {
        group.channel = null;
        return await this.groupProfileRepository.save(group);
    }

    async getGroupProfileByName(name: string): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .where('group.name = :name', { name })
            .andWhere('group.type IN (:...types)', {
                types: [EGroupChannelType.PUBLIC, EGroupChannelType.PROTECTED],
            })
            .leftJoinAndSelect('group.channel', 'channel')
            .getOne();
        if (!group) {
            throw new HttpException(
                'could not find group in getGroupProfileByName',
                HttpStatus.FORBIDDEN,
            );
        }
        return group;
    }

    async newPassword(
        group: GroupProfile,
        newPassword: string,
    ): Promise<GroupProfile> {
        const hash = await bcrypt.hash(newPassword, 10);
        group.password = hash;
        return await this.groupProfileRepository.save(group);
    }

    async validatePassword(
        groupProfile: GroupProfile,
        password: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, groupProfile.password);
    }

    async changePassword(
        userId: number,
        groupId: number,
        password: string,
    ): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .where('group.id = :id', { id: groupId })
            .leftJoinAndSelect('group.owner', 'owner')
            .getOne();
        if (!group) {
            throw new HttpException(
                'could not find group in changePassword',
                HttpStatus.FORBIDDEN,
            );
        }
        if (group.owner.id !== userId) {
            throw new HttpException(
                'user is not owner of group',
                HttpStatus.FORBIDDEN,
            );
        }
        return this.newPassword(group, password);
    }

    async getGroupProfileAndCheckPassword(
        user: User,
        groupId: number,
        password: string,
    ): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .where('group.id = :id', { id: groupId })
            .leftJoinAndSelect('group.channel', 'channel')
            .leftJoinAndSelect('channel.users', 'users')
            .getOne();
        if (!group) {
            throw new HttpException(
                'could not find group in getGroupProfileAndCheckPassword',
                HttpStatus.FORBIDDEN,
            );
        }
        if (!(await this.validatePassword(group, password))) {
            throw new HttpException('wrong password', HttpStatus.FORBIDDEN);
        }
        return group;
    }

    async reassignOwner(group: GroupProfile, userId: number): Promise<boolean> {
        let newOwner = group.admin.find((admin) => admin.id !== userId);
        if (!newOwner) {
            newOwner = group.channel.users.find((user) => user.id !== userId);
            if (!newOwner) {
                return false;
            }
            group.admin.push(newOwner);
        }
        console.log('newOwner: ', newOwner);
        group.owner = newOwner;
        await this.groupProfileRepository.save(group);
        return true;
    }

    async removeRoles(group: GroupProfile, userId: number): Promise<any> {
        group.admin.filter((admin) => admin.id !== userId);
        // group.blocked.filter((blocked) => blocked.id !== userId);
        // group.muted.filter((muted) => muted.id !== userId);
        return await this.groupProfileRepository.save(group);
    }

    async addMutedTime(user: User, group: GroupProfile): Promise<any> {
        const mutedTime = new MutedTime();
        mutedTime.time = new Date();
        mutedTime.time.setMinutes(mutedTime.time.getMinutes() + 1);
        mutedTime.user = [];
        mutedTime.groupProfile = [];
        mutedTime.user.push(user);
        mutedTime.groupProfile.push(group);
        return await this.mutedTimeRepository.save(mutedTime);
    }

    async removeMutedTime(user: User, group: GroupProfile): Promise<any> {
        const mutedTime = await this.mutedTimeRepository
            .createQueryBuilder('mutedTime')
            .leftJoinAndSelect('mutedTime.user', 'user')
            .leftJoinAndSelect('mutedTime.groupProfile', 'groupProfile')
            .where('user.id = :userId', { userId: user.id })
            .andWhere('groupProfile.id = :groupId', {
                groupId: group.id,
            })
            .getOne();
        if (!mutedTime) {
            throw new HttpException(
                'could not find mutedTime in removeMutedTime',
                HttpStatus.FORBIDDEN,
            );
        }
        return await this.mutedTimeRepository.remove(mutedTime);
    }

    async checkMuted(userId: number, channelId: number): Promise<boolean> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.channel', 'channel')
            .leftJoinAndSelect('group.muted', 'muted')
            .where('channel.id = :channelId', { channelId })
            .getOne();
        if (!group) {
            return false;
        }
        const muted = group.muted.find((muted) => muted.id === userId);
        if (!muted) {
            return false;
        }
        const mutedTime = await this.checkMutedTime(muted, group);
        if (!mutedTime) {
            return false;
        }
        return true;
    }

    async checkMutedTime(user: User, group: GroupProfile): Promise<boolean> {
        const mutedTime = await this.mutedTimeRepository
            .createQueryBuilder('mutedTime')
            .leftJoinAndSelect('mutedTime.user', 'user')
            .leftJoinAndSelect('mutedTime.groupProfile', 'groupProfile')
            .where('user.id = :userId', { userId: user.id })
            .andWhere('groupProfile.id = :groupId', { groupId: group.id })
            .addSelect('mutedTime.time')
            .getOne();
        if (!mutedTime) {
            return false;
        }
        if (mutedTime.time < new Date()) {
            await this.removeMute(group, user);
            return false;
        }
        return true;
    }

    async checkValidGroupName(name: string): Promise<any> {
        const groupCheck = await this.groupProfileRepository
            .createQueryBuilder('group')
            .addSelect(['group.name'])
            .where('group.name = :name', { name })
            .getOne();
        if (groupCheck) {
            throw new HttpException(
                'group name already exists',
                HttpStatus.FORBIDDEN,
            );
        }
    }
}
