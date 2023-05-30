import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { createQueryBuilder, Repository } from 'typeorm'
import { Message } from '../entities/message.entity'
import { UserService } from '../../user/services/user/user.service'
import { ChannelService } from './channel.service'
import { MessageDto } from '../dtos/chat.dtos'

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        private readonly userService: UserService,
        private readonly channelService: ChannelService
    ) {}

    // add the channel id to this
    async createMessage(payload: MessageDto): Promise<Message> {
        const message = new Message()
        const sender = await this.userService.findUserByID(payload.sender.id)
        if (!sender) {
            throw new HttpException('could not find user', HttpStatus.FORBIDDEN)
        }
        message.sender = sender
        const channel = await this.channelService.isSenderValidatedReturnChannel(payload)
        message.channel = channel
        message.text = payload.text
        return await this.messageRepository.save(message)
    }
}
