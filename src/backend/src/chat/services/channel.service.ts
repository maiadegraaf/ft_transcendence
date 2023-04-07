import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
// import { User } from '../../users/entities/users.entity';
import { UserService } from '../../user/services/user/user.service';
import { GroupProfile } from '../entities/groupProfile.entity';
import { GroupProfileService } from './groupProfile.service';
import { use } from 'passport';
import { promises } from 'dns';
import {
  ChannelMessagesDto,
  MessageDto,
  UserChannelsMessagesDto,
} from '../dtos/chat.dtos';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly groupProfileService: GroupProfileService,
    private readonly userService: UserService,
  ) {}

  async createChannel(): Promise<Channel> {
    const channel = new Channel();
    return await this.channelRepository.save(channel);
  }

  async getChannelById(channelId: number): Promise<any> {
    try {
      const channel = await this.channelRepository.findOne({
        where: { id: channelId },
      });
      if (!channel) {
        throw new HttpException(
          'Channel with ID ${id} not found',
          HttpStatus.FORBIDDEN,
        );
      }
      return channel;
    } catch {}
  }

  async newDmChannel(user1: number, user2: number): Promise<any> {
    try {
      let channel = await this.createChannel();
      if (!channel) {
        throw new HttpException(
          'Could not create new dm channel',
          HttpStatus.FORBIDDEN,
        );
      }
      if (!(await this.userService.addChannelToUser(channel, user1))) {
        throw new HttpException(
          'Could not add user to dm channel',
          HttpStatus.FORBIDDEN,
        );
      }
      channel = await this.channelRepository.save(channel);
      if (!(await this.userService.addChannelToUser(channel, user2))) {
        throw new HttpException(
          'Could not add user to dm channel',
          HttpStatus.FORBIDDEN,
        );
      }
      return await this.channelRepository.save(channel);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async newGroupChannel(ownerId: number, groupName: string): Promise<any> {
    try {
      const channel = await this.createChannel();
      if (!channel) {
        throw new HttpException(
          'could not create channel',
          HttpStatus.FORBIDDEN,
        );
      }
      const groupProfile = await this.groupProfileService.createGroupProfile(
        ownerId,
        groupName,
        channel,
      );
      if (!groupProfile) {
        throw new HttpException(
          'could not create groupProfile',
          HttpStatus.FORBIDDEN,
        );
      }
      channel.profile = groupProfile;
      return await this.channelRepository.save(channel);
    } catch {}
  }

  async getMessagesFromChannel(channelId: number): Promise<any> {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['messages'],
    });
    console.log(channel);
    if (channel) {
      return channel.messages;
    }
  }

  async getUserChannelDTO(userId: number): Promise<any> {
    const user = await this.userService.retrieveUserChannelMessages(userId);

    if (!user) {
      return;
    }
    // console.log('this is user: ' + JSON.stringify(user));
    const userChannelMessageDTO: UserChannelsMessagesDto = {
      id: user.id,
      name: user.login,
      channels: user.channels.map((channel) => {
        const channelMessageDTO: ChannelMessagesDto = {
          id: channel.id,
          messages: channel.messages.map((message) => {
            const messageDTO: MessageDto = {
              id: message.id,
              sender: message.sender.id,
              senderName: message.sender.login,
              channel: channel.id,
              text: message.text,
            };
            return messageDTO;
          }),
        };
        return channelMessageDTO;
      }),
    };
    // console.log('this is the DTO: ' + JSON.stringify(userChannelMessageDTO));
    return userChannelMessageDTO;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // async getUserChatData(userId: number): Promise<any> {}
}
