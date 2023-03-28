import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { User } from '../../users/entities/users.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>, // private readonly userService: UserService();
  ) {}

  async createChannel(): Promise<Channel> {
    const channel = new Channel();
    return this.channelRepository.save(channel);
  }

  async addUserToChannel(channelId: number, UserId: number): Promise<any> {
    const channel = this.channelRepository.findOne({
      where: { id: channelId },
    });
    // const user = this.userService.findUser();
    // const user[] = userService.findUser(UserId);
    // channel.users.push(user);
    // const user = this.channelRepository.findOne({
    //   where: { channelId },
    // });
    return;
  }

  async getChannel(id: number): Promise<Channel> {
    return this.channelRepository.findOne({ where: { id } }); // .getId(id);
  }
}
