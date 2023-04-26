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

    async addAdmin(groupId: number, user: User): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .where('group.id = :id', { id: groupId })
            .leftJoinAndSelect('group.admin', 'admin')
            .getOne();
        // .leftJoinAndSelect('group.channels', 'channels')
        // .where('channels.id = :id', { id: groupId })
        // .leftJoin('group.admin', 'admin')
        // const user = await this.userService.findUserByID(groupId);
        if (!user) {
            throw new HttpException(
                'Could not find user',
                HttpStatus.FORBIDDEN,
            );
        }
        group.admin.push(user);
        return await this.groupProfileRepository.save(group);
    }

    async addBlocked(user: User, groupId: number): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.channels', 'channels')
            .where('channels.id = :id', { id: groupId })
            .innerJoin('group.blocked', 'blocked')
            .getOne();
        group.blocked.push(user);
        return await this.groupProfileRepository.save(group);
    }

    async addMute(user: User, groupId: number): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.channels', 'channels')
            .where('channels.id = :id', { id: groupId })
            .innerJoin('group.muted', 'muted')
            .getOne();
        group.muted.push(user);
        return await this.groupProfileRepository.save(group);
    }

    async deleteAdmin(groupId: number, user: User): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.channels', 'channels')
            .where('channels.id = :id', { id: groupId })
            .innerJoin('group.admin', 'admin')
            .getOne();
        group.admin = group.admin.filter((admin) => admin.id !== user.id);
        return await this.groupProfileRepository.save(group);
    }

    async deleteBlocked(user: User, groupId: number): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.channels', 'channels')
            .where('channels.id = :id', { id: groupId })
            .innerJoin('group.blocked', 'blocked')
            .getOne();
        group.blocked = group.blocked.filter(
            (blocked) => blocked.id !== user.id,
        );
        return await this.groupProfileRepository.save(group);
    }

    async deleteMute(user: User, groupId: number): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.channels', 'channels')
            .where('channels.id = :id', { id: groupId })
            .innerJoin('group.muted', 'muted')
            .getOne();
        group.muted = group.muted.filter((muted) => muted.id !== user.id);
        return await this.groupProfileRepository.save(group);
    }
}
