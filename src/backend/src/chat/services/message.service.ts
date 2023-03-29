import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { UsersService } from '../../users/services/users/users.service';
import { ChannelService } from './channel.service';
// import { Channel } from '../entities/channel.entity';
// import { User } from '../../user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    private readonly UsersService: UsersService,
    private readonly ChannelService: ChannelService,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  // add the channel id to this
  async createMessage(payload: { userId: number; text: string; channelId: number }): Promise<Message> {
    const message = new Message();
    message.sender = await this.UsersService.findUserByID(payload.userId);
    message.text = payload.text;
    message.channel = await this.ChannelService.getChannelById(payload.channelId);
    return this.messageRepository.save(message);
  }

  async getMessagesByChannelID(id: number): Promise<Message[]> {
    return this.messageRepository.find({ where: { id } });
  }
}
