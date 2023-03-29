import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
// import { User } from '../../users/entities/users.entity';
import { UsersService } from '../../users/services/users/users.service';
import { ChannelEnum } from '../../utils/types';
import { GroupProfile } from '../entities/groupProfile.entity';
import { GroupProfileService } from './groupProfile.service';
import { use } from 'passport';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly groupProfileService: GroupProfileService,
    private readonly userService: UsersService,
  ) {}

  async createChannel(): Promise<Channel> {
    const channel = new Channel();
    return await this.channelRepository.save(channel);
  }
  async getChannelById(id: number): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      where: { id },
    });
    if (!channel) {
      throw new NotFoundException('Channel with ID ${id} not found');
    }
    return channel;
  }
  async addUserToChannel(channelId: number, userId: number): Promise<any> {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['users'],
    });
    if (!channel) {
      throw new NotFoundException('Channel with ID ${id} not found');
    }
    const user = await this.userService.findUserByID(userId);
    channel.users.push(user);
    await this.channelRepository.save(channel);
    // await this.userService.addChannelToUser(userId, channelId);
    // user.channels.push(channel);
    // if (!(await this.userService.saveUser(user))) {
    //   throw new InternalServerErrorException('channel cannot be saved in user');
    // }
    return channel;
  }

  async newDmChannel(user1: number, user2: number): Promise<any> {
    const channel = await this.createChannel();
    if (
      !(await this.addUserToChannel(channel.id, user1)) ||
      !(await this.addUserToChannel(channel.id, user2))
    ) {
      throw new InternalServerErrorException(
        'could not save users to DM channel',
      );
    }
    return await this.channelRepository.save(channel);
  }

  async newGroupChannel(ownerId: number, groupName: string): Promise<any> {
    const channel = await this.createChannel();
    if (!channel) {
      throw new InternalServerErrorException('could not create channel');
    }
    const groupProfile = await this.groupProfileService.createGroupProfile(
      ownerId,
      groupName,
      channel,
    );
    if (!groupProfile) {
      throw new InternalServerErrorException('could not create groupProfile');
    }
    channel.profile = groupProfile;
    return await this.channelRepository.save(channel);
  }

  async getChannelsByUserId(userId: number): Promise<any> {
    const user = await this.userService.findUserByID(userId);
    if (!user) {
      throw new InternalServerErrorException('Could not find user');
    }
    return user.channels;
  }
}
