import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
// import { User } from '../../users/entities/users.entity';
import { UserService } from '../../user/services/user/user.service';
import { GroupProfile } from '../entities/groupProfile.entity';
import { GroupProfileService } from './groupProfile.service';
import { use } from 'passport';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>,
        private readonly groupProfileService: GroupProfileService,
        private readonly userService: UserService,
    ) {}

    async createChannel(): Promise<Channel> {
        const channel = new Channel();
        return await this.channelRepository.save(channel);
    }

    async getChannelById(channelId: number): Promise<any> {
        try {
            const channel = await this.channelRepository.findOne({
                where: { id: channelId },
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

    async addUserToChannel(channel: Channel, userId: number): Promise<any> {
        try {
            // const channel = await this.channelRepository.findOne({
            //       //   where: { id: channelId },
            //       //   relations: ['users'],
            //       // });
            //       // if (!channel) {
            //       //   return ;
            //       //   throw new HttpException(
            //       //     'Channel with ID ${id} not found',
            //       //     HttpStatus.FORBIDDEN,
            //       //   );
            //       // }

            console.log('addUserToChannel channel ' + channel.id);
            const user = await this.userService.findUserByID(userId);
            console.log('user ' + user.id);
            channel.users.push(user);
            await this.channelRepository.save(channel);
            await this.userService.addChannelToUser(channel, userId);
        } catch {}
    }

    async newDmChannel(user1: number, user2: number): Promise<any> {
        try {
            const channel = await this.createChannel();
            await this.addUserToChannel(channel, user1);
            // console.log('newDmChannel ' + channel1.id);
            await this.addUserToChannel(channel, user2);
            // if (
            //   !(await this.addUserToChannel(channel.id, user1)) ||
            //   !(await this.addUserToChannel(channel.id, user2))
            // ) {
            //   throw new HttpException(
            //     'could not save users to DM channel',
            //     HttpStatus.FORBIDDEN,
            //   );
            // }
            // console.log('newDmChannel ' + channel2);
            await this.channelRepository.save(channel);
            // console.log('testje!');
            return channel;
        } catch {}
    }

    async newGroupChannel(ownerId: number, groupName: string): Promise<any> {
        try {
            const channel = await this.createChannel();
            if (!channel) {
                throw new HttpException(
                    'could not create channel',
                    HttpStatus.FORBIDDEN,
                );
            }
            const groupProfile =
                await this.groupProfileService.createGroupProfile(
                    ownerId,
                    groupName,
                    channel,
                );
            if (!groupProfile) {
                throw new HttpException(
                    'could not create groupProfile',
                    HttpStatus.FORBIDDEN,
                );
            }
            channel.profile = groupProfile;
            return await this.channelRepository.save(channel);
        } catch {}
    }

    async getChannelsByUserId(userId: number): Promise<any> {
        try {
            const user = await this.userService.findUserByID(userId);
            if (!user) {
                throw new HttpException(
                    'Could not find user',
                    HttpStatus.FORBIDDEN,
                );
            }
            console.log(user);
            const channels = await this.channelRepository.find({
                where: { users: user },
                relations: ['users'],
            });
            // JSON.parse(channels)
            console.log(channels);
            return channels;
            // const channels = await this.userService.getChannelsByUserId(userId);
            // user.channels;

            // find({
            //   where: { users: user },
            //   relations: ['users'],
            // });
            // console.log(user.channels);
            // return user.channels;
            // console.log(channels);
            // return channels;
        } catch {}
    }
}
