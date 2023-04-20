import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { GroupProfileService } from './groupProfile.service';
import { User } from '../../user/user.entity';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>,
        private readonly groupProfileService: GroupProfileService,
    ) {}

    private logger = new Logger('ChannelService');

    async createChannel(): Promise<Channel> {
        const channel = new Channel();
        return await this.channelRepository.save(channel);
    }

    async getChannelById(channelId: number): Promise<any> {
        try {
            const channel = await this.channelRepository.findOne({
                where: { id: channelId },
                relations: ['messages', 'messages.sender'],
            });
            if (!channel) {
                throw new HttpException(
                    'Channel with ID ${id} not found',
                    HttpStatus.FORBIDDEN,
                );
            }
            return channel;
        } catch {}
    }

    async newDmChannel(user1: User, user2: User): Promise<any> {
        try {
            const channel = await this.createChannel();
            if (!channel) {
                throw new HttpException(
                    'Could not create new dm channel',
                    HttpStatus.FORBIDDEN,
                );
            }
            channel.users = [];
            channel.users.push(user1);
            channel.users.push(user2);
            this.logger.log('created new dm channel');
            return await this.channelRepository.save(channel);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getUserChannels(userId: number): Promise<Channel[]> {
        // const channels = await this.userService.retrieveUserChannelMessages(userId);
        const channels = await this.channelRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.users', 'user')
            .where('user.id = :id', { id: userId })
            .leftJoinAndSelect('channel.messages', 'message')
            .leftJoin('message.sender', 'sender')
            .addSelect(['sender.id', 'sender.login'])
            .leftJoinAndSelect('channel.profile', 'profile')
            .orderBy('message.id', 'ASC')
            .getMany();
        if (!channels) {
            return;
        }
        for (const ch of channels) {
            ch['name'] = await this.getChannelName(ch.id, userId);
        }
        return channels;
    }

    async getChannelName(channel: number, userId: number): Promise<string> {
        const channelName = await this.channelRepository.findOne({
            where: { id: channel },
            relations: ['profile', 'users'],
        });
        if (!channelName) {
            return null;
        }
        if (channelName.profile) {
            return channelName.profile.name;
        }
        const channelUsers = channelName.users;
        let name;
        await channelUsers.forEach((usr) => {
            if (usr.id != userId) {
                name = usr.login;
            }
        });
        return name;
    }

    async allowedNewDmChannel(user: User, invitee: string): Promise<boolean> {
        if (user.login === invitee) {
            return false;
        }
        const channel = await this.channelRepository
            .createQueryBuilder('channel')
            .leftJoinAndSelect('channel.users', 'users')
            .where('users', { users: user })
            .andWhere('users.login = :login', { login: invitee })
            .andWhere('channel.profile IS NULL')
            .getOne();
        if (channel) {
            return false;
        }
        return true;
    }

    async newGroupChannel(owner: User, groupName: string): Promise<any> {
        // check if group name is unique || not a username
        const channel = await this.createChannel();
        if (!channel) {
            throw new HttpException(
                'could not create channel',
                HttpStatus.FORBIDDEN,
            );
            return;
        }
        const groupProfile = await this.groupProfileService.createGroupProfile(
            owner,
            groupName,
        );
        channel.users = [];
        channel.users.push(owner);
        channel.profile = groupProfile;
        return await this.channelRepository.save(channel);
    }
}
