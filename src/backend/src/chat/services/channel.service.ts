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

  async addUserToChannel(channelId: number, userId: number): Promise<any> {
    try {
      const channel = await this.channelRepository.findOne({
        where: { id: channelId },
        relations: ['users'],
      });
      if (!channel) {
        throw new HttpException(
          'Channel with ID ${id} not found',
          HttpStatus.FORBIDDEN,
        );
      }
      const user = await this.userService.findUserByID(userId);
      channel.users.push(user);
      return await this.channelRepository.save(channel);
    } catch {}
  }

  async newDmChannel(user1: number, user2: number): Promise<any> {
    try {
      const channel = await this.createChannel();
      if (
        !(await this.addUserToChannel(channel.id, user1)) ||
        !(await this.addUserToChannel(channel.id, user2))
      ) {
        throw new HttpException(
          'could not save users to DM channel',
          HttpStatus.FORBIDDEN,
        );
      }
      return await this.channelRepository.save(channel);
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
      const groupProfile = await this.groupProfileService.createGroupProfile(
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
        throw new HttpException('Could not find user', HttpStatus.FORBIDDEN);
      }
      return user.channels;
    } catch {}
  }
}
