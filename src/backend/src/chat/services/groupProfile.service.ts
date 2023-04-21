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
// import { User } from '../../users/entities/users.entity';
import { UserService } from '../../user/services/user/user.service';
import { GroupProfile } from '../entities/groupProfile.entity';

@Injectable()
export class GroupProfileService {
    constructor(
        @InjectRepository(GroupProfile)
        private readonly groupProfileRepository: Repository<GroupProfile>,
        private readonly userService: UserService,
    ) {}

    async createGroupProfile(
        ownerId: number,
        groupName: string,
    ): Promise<GroupProfile> {
        const groupProfile = new GroupProfile();
        const groupOwner = await this.userService.findUserByID(ownerId);
        if (!groupProfile.admin.push(groupOwner)) {
            throw new HttpException(
                'Could not add group admin to group',
                HttpStatus.FORBIDDEN,
            );
        }
        groupProfile.owner = groupOwner;
        groupProfile.name = groupName;
        groupProfile.admin.push(groupOwner);
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
