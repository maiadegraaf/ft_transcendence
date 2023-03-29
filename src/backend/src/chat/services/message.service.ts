import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
// import { Channel } from '../entities/channel.entity';
// import { User } from '../../user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  // add the channel id to this
  async createMessage(
    payload: { name: string; text: string },
    // userId: User,
    // text: string,
    // channel: Channel,
  ): Promise<Message> {
    const message = new Message();
    // message.sender = payload.id;
    message.text = payload.text;
    // message.channel = channel;
    return this.messageRepository.save(message);
  }

  async getMessagesByChannelID(id: number): Promise<Message[]> {
    return this.messageRepository.find({ where: { id } });
  }
}
