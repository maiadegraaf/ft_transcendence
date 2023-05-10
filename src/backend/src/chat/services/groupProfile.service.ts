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
import {
    EGroupChannelType,
    GroupUserProfileUpdateDto,
} from '../dtos/chat.dtos';
import * as bcrypt from 'bcryptjs';

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
        console.log('userId: ', userId);
        console.log('groupId: ', groupId);
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
}
