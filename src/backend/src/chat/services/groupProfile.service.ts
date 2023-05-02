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
        group.admin.push(user);
        return await this.groupProfileRepository.save(group);
    }

    async addBlocked(param: GroupUserProfileUpdateDto): Promise<any> {
        const group = await this.adminCheck(param, 'blocked');
        const user = await this.userGroupProfileCheck(group, param);
        group.blocked.push(user);
        return await this.groupProfileRepository.save(group);
    }

    async addMute(param: GroupUserProfileUpdateDto): Promise<any> {
        const group = await this.adminCheck(param, 'muted');
        const user = await this.userGroupProfileCheck(group, param);
        group.muted.push(user);
        return await this.groupProfileRepository.save(group);
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
        group.admin.slice(idx, 1);
        return await this.groupProfileRepository.save(group);
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
        group.blocked.slice(idx, 1);
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
        group.muted.slice(idx, 1);
        return await this.groupProfileRepository.save(group);
    }

    async ownerCheck(param: GroupUserProfileUpdateDto): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .where('group.id = :id', { id: param.groupId })
            .leftJoinAndSelect('group.owner', 'owner')
            .andWhere('owner.id = :id', { id: param.userId })
            .leftJoinAndSelect('group.admin', 'admin')
            .leftJoinAndSelect('group.channel', 'channel')
            .leftJoinAndSelect('channel.users', 'users')
            .leftJoinAndSelect('users.login', 'login')
            .getOne();
        if (!group) {
            throw new HttpException(
                'add find group in addAdmin',
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
            .andHaving('admin.id = :userId', { userId: param.userId })
            .leftJoinAndSelect('group.' + type, type)
            .leftJoinAndSelect('group.channel', 'channel')
            .leftJoinAndSelect('channel.users', 'users')
            .leftJoinAndSelect('users.login', 'login')
            .getOne();
        if (!group) {
            throw new HttpException(
                'could not find group in adminCheck for ' + type,
                HttpStatus.FORBIDDEN,
            );
        }
    }
}
