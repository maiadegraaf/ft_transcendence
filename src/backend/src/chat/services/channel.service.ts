import {
    Body,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { UserService } from '../../user/services/user/user.service';
import { GroupProfile } from '../entities/groupProfile.entity';
import { GroupProfileService } from './groupProfile.service';
import {
    ChannelMessagesDto,
    CreateDmChannelDto,
    JoinRoomDto,
    MessageDto,
    returnDmChannelDto,
    UserChannelsMessagesDto,
} from '../dtos/chat.dtos';
import { User } from '../../user/user.entity';
import { ChatGateway } from '../gateway/chat.gateway';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>,
        private readonly groupProfileService: GroupProfileService,
        private readonly userService: UserService, // private readonly chatGateway: ChatGateway,
    ) {}

    private readonly chatGateway: ChatGateway;
    // private logger = new Logger('ChannelService');

    async createChannel(): Promise<Channel> {
        const channel = new Channel();
        return await this.channelRepository.save(channel);
    }

    async getChannelById(channelId: number): Promise<any> {
        try {
            const channel = await this.channelRepository.findOne({
                where: { id: channelId },
                relations: ['messages', 'messages.sender'],
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

    // async createDmChannel(
    //     @Body(new ValidationPipe()) param: CreateDmChannelDto,
    // ): Promise<any> {
    //     try {
    //         const user1 = await this.userService.getUserById(param.userId);
    //         if (!user1) {
    //             // this.logger.error(
    //             //     'createDmChannel: no user found for id: ' + param.userId,
    //             // );
    //             return;
    //         }
    //         const user2 = await this.userService.getUserByLogin(param.invitee);
    //         if (!user2) {
    //             // this.logger.error(
    //             //     'createDmChannel: no user found for name: ' +
    //             //         JSON.stringify(param),
    //             // );
    //             return;
    //         }
    //         const channel = await this.newDmChannel(param.userId, user2.id);
    //         if (!channel) {
    //             // this.logger.error(
    //             //     'createDmChannel: no new dm channel for users: ' +
    //             //         param.userId +
    //             //         ' & ' +
    //             //         param.invitee,
    //             // );
    //             return;
    //         }
    //         // this.logger.log(
    //         //     'postNewDMChannel: new dm channel for users: ' +
    //         //         param.userId +
    //         //         ' & ' +
    //         //         param.invitee,
    //         // );
    //         // await this.emitNewUserToChannel(user1, channel);
    //         await this.emitNewUserToChannel(user2, channel);
    //         const newChannelDto = this.newChannelDTO(channel);
    //         console.log(
    //             'this is newChannelDto :' + JSON.stringify(newChannelDto),
    //         );
    //         return newChannelDto;
    //     } catch {}
    // }

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
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async emitNewUserToChannel(user: User, channel: Channel): Promise<any> {
        const joinRoomDto = await this.newJoinRoomDto(channel, user);
        console.log(
            'this is newUserJoinRoomDto :' + JSON.stringify(JoinRoomDto),
        );
        const dmClient = this.chatGateway.getClientSocketById(user.id);
        if (dmClient) {
            console.log('this is dmCLien :' + dmClient.id);
            dmClient.emit('newUserToChannel', joinRoomDto);
        }
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

    async getUserChannels(userId: number): Promise<Channel[]> {
        // const channels = await this.userService.retrieveUserChannelMessages(userId);
        const channels = await this.channelRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.users', 'user')
            .where('user.id = :id', { id: userId })
            .leftJoinAndSelect('channel.messages', 'message')
            .leftJoin('message.sender', 'sender')
            .addSelect(['sender.id', 'sender.login'])
            .leftJoinAndSelect('channel.profile', 'profile')
            .orderBy('message.id', 'ASC')
            .getMany();

        if (!channels) {
            return;
        }

        return channels;
        // console.log('this is user: ' + JSON.stringify(user));
        // const userChannelMessageDTO: UserChannelsMessagesDto = {
        //     id: user.id,
        //     name: user.login,
        //     channels: user.channels.map((channel) => {
        //         const channelMessageDTO: ChannelMessagesDto = {
        //             id: channel.id,
        //             messages: channel.messages.map((message) => {
        //                 const messageDTO: MessageDto = {
        //                     id: message.id,
        //                     sender: message.sender.id,
        //                     senderName: message.sender.login,
        //                     channel: channel.id,
        //                     text: message.text,
        //                 };
        //                 return messageDTO;
        //             }),
        //         };
        //         return channelMessageDTO;
        //     }),
        // };
        // return userChannelMessageDTO;
    }

    newChannelDTO(channel: Channel): any {
        const channelDto: ChannelMessagesDto = {
            id: channel.id,
            messages: [],
            name: null,
            groupProfile: null,
        };
        return channelDto;
    }

    // async channelDTO(channel: Channel, user: User): Promise<any> {
    //     const channelName = await this.getChannelName(channel.id, user);
    //     const channelDto: ChannelMessagesDto = {
    //         id: channel.id,
    //         messages: channel.messages.map((message) => {
    //             const messageDTO: MessageDto = {
    //                 id: message.id,
    //                 sender: message.sender.id,
    //                 senderName: message.sender.login,
    //                 channel: channel.id,
    //                 text: message.text,
    //             };
    //             return messageDTO;
    //         }),
    //         name: channelName,
    //         groupProfile: null,
    //     };
    //     return channelDto;
    // }

    // async newReturnChannelDTO(channel: Channel, user: User): Promise<any> {
    //     const returnChannelDto: returnDmChannelDto = {
    //         channelId: channel.id,
    //         newInviteeId: user.id,
    //     };
    //     return returnChannelDto;
    // }

    async newJoinRoomDto(channel: Channel, user: User): Promise<any> {
        const name = await this.getChannelName(channel.id, user);
        const joinRoomDto: JoinRoomDto = {
            userId: user.id,
            userName: user.login,
            channelId: channel.id,
            channelName: name,
        };
        return joinRoomDto;
    }

    async getChannelName(channel: number, user: User): Promise<string> {
        const channelName = await this.channelRepository.findOne({
            where: { id: channel },
            relations: ['profile', 'users'],
        });
        if (!channelName) {
            return null;
        }
        if (channelName.profile) {
            return channelName.profile.name;
        }
        const channelUsers = channelName.users;
        const channelUserNames = channelUsers.map((usr) => usr.login);
        channelUserNames.forEach((name) => {
            if (name !== user.login) {
                console.log('this is name: ' + name);
                return name;
            }
        });
        return null;
    }

    async allowedNewDmChannel(user: User, invitee: string): Promise<boolean> {
        if (user.login === invitee) {
            return false;
        }
        const channel = await this.channelRepository
            .createQueryBuilder('channel')
            .leftJoinAndSelect('channel.users', 'users')
            .where('users', { users: user })
            .andWhere('users.login = :login', { login: invitee })
            .andWhere('channel.profile IS NULL')
            .getOne();
        if (channel) {
            return false;
        }
        return true;
    }

    async newGroupChannel(ownerId: number, groupName: string): Promise<any> {
        try {
            const channel = await this.createChannel();
            if (!channel) {
                throw new HttpException(
                    'could not create channel',
                    HttpStatus.FORBIDDEN,
                );
                return;
            }
            const groupProfile =
                await this.groupProfileService.createGroupProfile(
                    ownerId,
                    groupName,
                );
            channel.profile = groupProfile;
            return await this.channelRepository.save(channel);
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
