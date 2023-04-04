import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { UserService } from '../../user/services/user/user.service';
import { ChannelService } from './channel.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
  ) {}

  // add the channel id to this
  async createMessage(payload: {
    userId: number;
    text: string;
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
        console.log(payload);
        throw new HttpException('could not find user', HttpStatus.FORBIDDEN);
      }
      message.channel = channel;
      message.text = payload.text;
      return this.messageRepository.save(message);
    } catch {}
  }
  //
  // async getMessagesByChannelID(id: number): Promise<Message[]> {
  //   return await this.messageRepository.find({
  //     where: { id },
  //     relations: ['channel'],
  //   });
  //   //{ where: { channel: id} , relations: ['channel'] } });
  // }
}
