import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { UserService } from '../../user/services/user/user.service';
import { ChannelService } from './channel.service';
import { MessageDto } from '../dtos/chat.dtos';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        private readonly userService: UserService,
        private readonly channelService: ChannelService,
    ) {}

    // add the channel id to this
    async createMessage(payload: MessageDto): Promise<Message> {
        try {
            const message = new Message();
            const sender = await this.userService.findUserByID(payload.sender);
            if (!sender) {
                throw new HttpException(
                    'could not find user',
                    HttpStatus.FORBIDDEN,
                );
            }
            message.sender = sender;
            const channel = await this.channelService.getChannelById(
                payload.channel,
            );
            if (!channel) {
                console.log(payload);
                throw new HttpException(
                    'could not find user',
                    HttpStatus.FORBIDDEN,
                );
            }
            message.channel = channel;
            message.text = payload.text;
            return await this.messageRepository.save(message);
        } catch {}
    }

    async getMessageById(messageId: number): Promise<any> {
        const message = this.messageRepository.findOne({
            where: { id: messageId },
            // relations: ['text'],
        });
        return message;
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
