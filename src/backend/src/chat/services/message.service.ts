import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UsersService,
    private readonly channelService: ChannelService,
  ) {}

  // add the channel id to this
  async createMessage(payload: {
    text: string;
    userId: number;
    channelId: number;
  }): Promise<Message> {
    try {
      const message = new Message();
      const sender = await this.userService.findUserByID(payload.userId);
      if (!sender) {
        throw new HttpException('could not find user', HttpStatus.FORBIDDEN);
      }
      message.sender = sender;
      const channel = await this.channelService.getChannelById(
        payload.channelId,
      );
      if (!channel) {
        throw new HttpException('could not find user', HttpStatus.FORBIDDEN);
      }
      message.channel = channel;
      message.text = payload.text;
      return this.messageRepository.save(message);
    } catch {}
  }

  async getMessagesByChannelID(id: number): Promise<Message[]> {
    return this.messageRepository.find({ where: { id } });
  }
}
