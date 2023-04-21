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
        // groupProfile.owner = owner;
        // groupProfile.admin = [];
        // groupProfile.admin.push(owner);
        // groupProfile.name = groupName;
        // console.log(JSON.stringify(groupProfile));
        // const profile = await this.groupProfileRepository.save(groupProfile);
        // console.log(JSON.stringify(profile));
        // return profile;
        // return await this.groupProfileRepository.save(groupProfile);
    }

    async newGroupProfile(owner: User, groupName: string) {
        // const groupProfile = new GroupProfile();
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
        const profile = await this.groupProfileRepository.save(groupProfile);
        await this.groupProfileRepository.update(profile.id, {
            name: groupName,
            owner: owner,
            channel: null,
        });
        // GroupProfile.owner = owner;
        // GroupProfile.name = groupName;
        // groupProfile.owner = owner;
        // groupProfile.name = groupName;
        // groupProfile.channel = null;
        // profile.set('owner', owner);
        // profile.set('name', groupName);
        // profile.set('channel', null);
        // const pr = await this.groupProfileRepository.save(profile);

        return profile;
        // const groupAdmin = [];
        // groupAdmin.push(owner);
        // const profile = await this.groupProfileRepository.update(
        //     groupProfile.id,
        //     {
        //         channel: null,
        //         admin: groupAdmin,
        //         owner: owner,
        //         blocked: [],
        //         muted: [],
        //         name: groupName,
        //     },
        // );
        // JSON.stringify(profile);
        // throw new HttpException(
        //     'could not create group profile',
        //     HttpStatus.FORBIDDEN,
        // );
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
