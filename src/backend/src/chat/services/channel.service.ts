import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
// import { User } from '../../users/entities/users.entity';
import { UsersService } from '../../users/services/users/users.service';
import { ChannelEnum } from '../../utils/types';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly userService: UsersService,
  ) {}

  async createChannel(): Promise<Channel> {
    const channel = new Channel();
    return await this.channelRepository.save(channel);
  }

  async addUserToChannel(channelId: number, UserId: number): Promise<any> {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['users'],
    });
    if (!channel) {
      throw new NotFoundException('Channel with ID ${id} not found');
    }
    const user = await this.userService.findUserByID(UserId);
    channel.users.push(user);
    return await this.channelRepository.save(channel);
  }

  async newDmChannel(user1: number, user2: number): Promise<any> {
    const channel = await this.createChannel();
    await this.addUserToChannel(channel.id, user1);
    await this.addUserToChannel(channel.id, user2);
    return channel;
  }

  async newGroupChannel(name: string): Promise<any> {
    const channel = await this.createChannel();
    // channel.name = name;
  }

  // async getChannel(id: number): Promise<Channel> {
  //   return this.channelRepository.findOne({ where: { id } }); // .getId(id);
  // }
}
