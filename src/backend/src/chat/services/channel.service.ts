import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { GroupProfileService } from './groupProfile.service';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/services/user/user.service';
import { EGroupChannelType, MessageDto } from '../dtos/chat.dtos';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>,
        private readonly groupProfileService: GroupProfileService,
        private readonly userService: UserService,
    ) {}

    private logger = new Logger('ChannelService');

    async createChannel(): Promise<Channel> {
        const channel = new Channel();
        return await this.channelRepository.save(channel);
    }

    async getChannelById(channelId: number): Promise<any> {
        const channel = await this.channelRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.users', 'user')
            .where('channel.id = :id', { id: channelId })
            .leftJoinAndSelect('channel.messages', 'message')
            .leftJoin('channel.users', 'members')
            .addSelect(['members.id', 'members.login'])
            .leftJoin('message.sender', 'sender')
            .addSelect(['sender.id', 'sender.login'])
            .leftJoinAndSelect('channel.profile', 'profile')
            .leftJoin('profile.owner', 'owner')
            .addSelect(['owner.id', 'owner.login'])
            .leftJoin('profile.admin', 'admin')
            .addSelect(['admin.id', 'admin.login'])
            .leftJoin('profile.muted', 'muted')
            .addSelect(['muted.id', 'muted.login'])
            .leftJoin('profile.blocked', 'blocked')
            .addSelect(['blocked.id', 'blocked.login'])
            .orderBy('message.id', 'ASC')
            .getOne();
        if (!channel) {
            return;
        }
        return channel;
    }

    async newDmChannel(user1: User, user2: User): Promise<any> {
        try {
            await this.checkValidNewDm(user1, user2);
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

    async checkValidNewDm(user1: User, user2: User): Promise<any> {
        if (user1.id === user2.id) {
            throw new HttpException(
                'Cannot create dm with yourself',
                HttpStatus.FORBIDDEN,
            );
        }
        const channels = await this.channelRepository
            .createQueryBuilder('channel')
            .leftJoinAndSelect('channel.users', 'user')
            .where('channel.profile IS NULL')
            .getMany();
        if (channels) {
            for (const channel of channels) {
                const userIds = channel.users.map((user) => user.id);
                if (userIds.includes(user1.id) && userIds.includes(user2.id)) {
                    throw new HttpException(
                        'Dm already exists',
                        HttpStatus.FORBIDDEN,
                    );
                }
            }
        }
    }

    async getUserChannels(userId: number): Promise<Channel[]> {
        const channels = await this.channelRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.users', 'user')
            .where('user.id = :id', { id: userId })
            .leftJoinAndSelect('channel.messages', 'message')
            .leftJoin('channel.users', 'members')
            .addSelect(['members.id', 'members.login'])
            .leftJoin('message.sender', 'sender')
            .addSelect(['sender.id', 'sender.login'])
            .leftJoinAndSelect('channel.profile', 'profile')
            .leftJoin('profile.owner', 'owner')
            .addSelect(['owner.id', 'owner.login'])
            .leftJoin('profile.admin', 'admin')
            .addSelect(['admin.id', 'admin.login'])
            .leftJoin('profile.muted', 'muted')
            .addSelect(['muted.id', 'muted.login'])
            .leftJoin('profile.blocked', 'blocked')
            .addSelect(['blocked.id', 'blocked.login'])
            .orderBy('message.id', 'ASC')
            .getMany();
        if (!channels) {
            return;
        }
        const blockedUsers = await this.userService.getBlockedUsersForUser(
            userId,
        );
        if (!blockedUsers) {
            return channels;
        }
        for (const channel of channels) {
            for (const blockedUser of blockedUsers) {
                channel.messages = channel.messages.filter(
                    (msg) => msg.sender.id !== blockedUser.id,
                );
            }
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

    async newGroupChannel(
        owner: User,
        groupName: string,
        type: EGroupChannelType,
        password?: string,
    ): Promise<any> {
        // check if groupName is unique
        // console.log('user');
        // console.log(owner);
        const channel = await this.createChannel();
        if (!channel) {
            throw new HttpException(
                'could not create channel',
                HttpStatus.FORBIDDEN,
            );
            return;
        }
        const groupProfile = await this.groupProfileService.newGroupProfile(
            owner,
            groupName,
            channel,
            type,
            password,
        );
        if (!groupProfile) {
            throw new HttpException(
                'Could not create new group profile',
                HttpStatus.FORBIDDEN,
            );
        }
        channel.profile = groupProfile;
        channel.users = [];
        channel.users.push(owner);
        return await this.channelRepository.save(channel);
    }
    //
    // async deleteChannel(channelId: number): Promise<any> {
    //     try {
    //         const channel = await this.channelRepository.findOne({
    //             where: { id: channelId },
    //         });
    //         if (!channel) {
    //             throw new HttpException(
    //                 'Channel with ID ${id} not found to delete channel',
    //                 HttpStatus.FORBIDDEN,
    //             );
    //         }
    //         await this.channelRepository.remove(channel);
    //         return;
    //     } catch (error) {
    //         throw new HttpException(
    //             error.message,
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }

    async deleteChannel(channel: Channel): Promise<any> {
        await this.channelRepository.remove(channel);
    }

    async nullifyProfile(channel: Channel): Promise<any> {
        channel.profile = null;
        return await this.channelRepository.save(channel);
    }

    async addUserToChannel(channelId: number, user: User): Promise<any> {
        try {
            const channel = await this.channelRepository.findOne({
                where: { id: channelId },
                relations: ['users', 'profile', 'messages'],
            });
            if (!channel) {
                throw new HttpException(
                    'Channel with ID ${id} not found to add users',
                    HttpStatus.FORBIDDEN,
                );
            }
            channel.users.push(user);
            return await this.channelRepository.save(channel);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async removeUserFromChannel(channelId: number, user: User): Promise<any> {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['users'],
        });
        if (!channel || !channel.users) {
            throw new HttpException(
                'Channel with ID ${id} not found to remove users',
                HttpStatus.FORBIDDEN,
            );
        }
        const idx = channel.users.findIndex((u) => u.id === user.id);
        if (idx === -1) {
            throw new HttpException(
                'User not found in channel to remove',
                HttpStatus.FORBIDDEN,
            );
        }
        channel.users.splice(idx, 1);
        return await this.channelRepository.save(channel);
    }

    async isSenderValidatedReturnChannel(payload: MessageDto): Promise<any> {
        const channel = await this.channelRepository
            .createQueryBuilder('channel')
            .where('channel.id = :id', { id: payload.channel })
            .leftJoinAndSelect('channel.profile', 'profile')
            .leftJoinAndSelect('profile.muted', 'muted')
            .getOne();
        if (!channel) {
            throw new HttpException(
                'isSenderValidatedReturnChannel: Channel not found to validate sender',
                HttpStatus.FORBIDDEN,
            );
        }
        if (!channel.profile) {
            return channel;
        }
        if (channel.profile.muted.find((u) => u.id === payload.sender.id)) {
            throw new HttpException(
                'isSenderValidatedReturnChannel: Sender with id' +
                    payload.sender.id +
                    ' is muted',
                HttpStatus.FORBIDDEN,
            );
        }
        return channel;
    }

    async getBlockedList(param: MessageDto): Promise<any> {
        const channel = await this.channelRepository
            .createQueryBuilder('channel')
            .where('channel.id = :id', { id: param.channel })
            .leftJoinAndSelect('channel.users', 'users')
            .leftJoin('users.blockedUsers', 'blockedUsers')
            .addSelect('blockedUsers.id')
            .getOne()
        if (!channel) {
            throw new HttpException(
                'getBlockedList: Channel not found to get blocked list',
                HttpStatus.FORBIDDEN
            )
        }
        if (!channel.users) {
            return []
        }
        const users = channel.users.filter((user) => {
            return (
                !user.blockedUsers || !user.blockedUsers.map((u) => u.id).includes(param.sender.id)
            )
        })
        return users
    }
}
