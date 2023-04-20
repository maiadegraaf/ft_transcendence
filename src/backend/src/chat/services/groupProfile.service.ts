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

    async createGroupProfile(
        owner: User,
        groupName: string,
    ): Promise<GroupProfile> {
        const groupProfile = new GroupProfile();
        groupProfile.owner = owner;
        groupProfile.admin = [];
        // groupProfile.blocked = [];
        // groupProfile.muted = [];
        groupProfile.admin.push(owner);
        groupProfile.name = groupName;
        return await this.groupProfileRepository.save(groupProfile);
    }

    async addAdmin(userId: number, channelId: number): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.channels', 'channels')
            .where('channels.id = :id', { id: channelId })
            .leftJoin('group.admin', 'admin')
            .getOne();
        const user = await this.userService.findUserByID(userId);
        if (!user) {
            throw new HttpException(
                'Could not find user',
                HttpStatus.FORBIDDEN,
            );
        }
        group.admin.push(user);
        return await this.groupProfileRepository.save(group);
    }

    async addBlocked(userId: number, channelId: number): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.channels', 'channels')
            .where('channels.id = :id', { id: channelId })
            .innerJoin('group.blocked', 'blocked')
            .getOne();
        const user = await this.userService.findUserByID(userId);
        if (!user) {
            throw new HttpException(
                'Could not find user',
                HttpStatus.FORBIDDEN,
            );
        }
        group.blocked.push(user);
        return await this.groupProfileRepository.save(group);
    }

    async addMute(userId: number, channelId: number): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.channels', 'channels')
            .where('channels.id = :id', { id: channelId })
            .innerJoin('group.muted', 'muted')
            .getOne();
        const user = await this.userService.findUserByID(userId);
        if (!user) {
            throw new HttpException(
                'Could not find user',
                HttpStatus.FORBIDDEN,
            );
        }
        group.muted.push(user);
        return await this.groupProfileRepository.save(group);
    }

    async deleteAdmin(userId: number, channelId: number): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.channels', 'channels')
            .where('channels.id = :id', { id: channelId })
            .innerJoin('group.admin', 'admin')
            .getOne();
        const user = await this.userService.findUserByID(userId);
        if (!user) {
            throw new HttpException(
                'Could not find user',
                HttpStatus.FORBIDDEN,
            );
        }
        group.admin = group.admin.filter((admin) => admin.id !== user.id);
        return await this.groupProfileRepository.save(group);
    }

    async deleteBlocked(userId: number, channelId: number): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.channels', 'channels')
            .where('channels.id = :id', { id: channelId })
            .innerJoin('group.blocked', 'blocked')
            .getOne();
        const user = await this.userService.findUserByID(userId);
        if (!user) {
            throw new HttpException(
                'Could not find user',
                HttpStatus.FORBIDDEN,
            );
        }
        group.blocked = group.blocked.filter(
            (blocked) => blocked.id !== user.id,
        );
        return await this.groupProfileRepository.save(group);
    }

    async deleteMute(userId: number, channelId: number): Promise<any> {
        const group = await this.groupProfileRepository
            .createQueryBuilder('group')
            .leftJoinAndSelect('group.channels', 'channels')
            .where('channels.id = :id', { id: channelId })
            .innerJoin('group.muted', 'muted')
            .getOne();
        const user = await this.userService.findUserByID(userId);
        if (!user) {
            throw new HttpException(
                'Could not find user',
                HttpStatus.FORBIDDEN,
            );
        }
        group.muted = group.muted.filter((muted) => muted.id !== user.id);
        return await this.groupProfileRepository.save(group);
    }
}
