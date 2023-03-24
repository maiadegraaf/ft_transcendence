import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async createChannel(): Promise<Channel> {
    const channel = new Channel();
    return this.channelRepository.save(channel);
  }

  async getChannel(id: number): Promise<Channel> {
    return this.channelRepository.findOne({ where: { id } }); // .getId(id);
  }
}
