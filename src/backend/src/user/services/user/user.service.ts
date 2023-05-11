import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../../chat/entities/channel.entity';
import { Avatar } from 'src/user/avatar.entity';
import { AvatarService } from './avatar.service';
import { async } from 'rxjs';
// import {Channel} from "../../../chat/entities/channel.entity";
// import { Post } from 'src/typeorm/entities/Post';
// import { Profile } from 'src/typeorm/entities/Profile';
// import { CreateUserParams, CreateUserPostParams, CreateUserProfileParams, UpdateUserParams } from 'src/utils/types';

@Injectable()
export class UserService {
    constructor(
        private readonly avatarService: AvatarService,

        @InjectRepository(Avatar)
        private avatarRepository: Repository<Avatar>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findAllUsers() {
        return await this.userRepository.find();
        // return this.userRepository.find({ relations: ['profile',  ]}) //will show relation with get request. null if not defined
    }

    async findUserByID(id: number, relations = [] as string[]): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations,
        });
        if (!user) {
            throw new NotFoundException('User with ID ' + id + ' not found');
        }
        return user;
    }

    async findOrCreateUser(
        id: number,
        email: string,
        login: string,
    ): Promise<User> {
        let user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            const avatar = await this.avatarService.createDefaultAvatar(user);
            user = await this.userRepository.save({ id, email, login, avatar });
        }
        user = await this.userRepository.findOne({ where: { id } });
        return user;
    }

    async deleteUser(id: number): Promise<DeleteResult> {
        return this.userRepository.delete({ id });
    }

    async changeUsername(id: number, newUserName: string): Promise<User> {
        return await this.userRepository.save({ id, login: newUserName });
    }

    async getUserByName(login: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { login },
            relations: ['login'],
        });
        if (!user) {
            return false;
        }
        return user;
    }

    async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
        console.log(userId);
        return this.userRepository.update(userId, {
            twoFactorAuthenticationSecret: secret,
        });
    }

    async turnOnTwoFactorAuthentication(userId: number) {
        return this.userRepository.update(userId, {
            isTwoFactorAuthenticationEnabled: true,
        });
    }

    async getChannelsByUserId(userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['channels'],
        });
        // console.log('getChannelsByUserId: user' + JSON.stringify(user.channels));
        return user.channels;
    }

    async getUserNameById(userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        // console.log('getChannelsByUserId: user' + JSON.stringify(user.channels));
        return user.login;
    }

    async addChannelToUser(channel: Channel, userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['channels'],
        });
        user.channels.push(channel);
        return await this.userRepository.save(user);
    }

    async retrieveUserChannelMessages(userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['channels'],
            select: ['channels'],
        });
        if (!user) {
            return null;
        }
        return user.channels;
    }

    async retrieveUserChannel(userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['channels'],
        });
        if (!user) {
            return null;
        }
        return user;
    }

    async getUserByLogin(userLogin: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { login: userLogin },
        });
        return user;
    }

    async getUserById(userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        return user;
    }

    async addSocketIdToUser(user: User, socketId: string): Promise<any> {
        if (user.socketId) {
            // add logic here if user is in a match or waitlist.
            console.log(
                'Replacing socketId ' +
                    user.socketId +
                    ' with ' +
                    socketId +
                    ' for user ' +
                    user.login,
            );
        }
        user.socketId = socketId;
        return this.userRepository.save(user);
    }

    async returnUserBySocketId(socketId: string): Promise<User> {
        for (const u of await this.findAllUsers()) {
            if (u.socketId === socketId) {
                console.log(
                    'Found user ' + u.login + ' with socketId ' + socketId,
                );
                return u;
            }
        }
        // return this.userRepository.findOne({ where: { socketId: socketId } });
    }

    async setAvatar(userId: number, file: Express.Multer.File): Promise<void> {
        if (!file) {
            throw new BadRequestException('File required');
        }
        const user: User = await this.findUserByID(userId, ['avatar']);
        if (user.avatar) {
            // updatae avatar
            user.avatar.data = file.buffer;
            user.avatar.filename = file.originalname;
            await this.avatarRepository.save(user.avatar);
        } else {
            // create avatar
            const filename = file.originalname;
            const data = file.buffer;
            await this.avatarService.createAvatar(filename, data, user);
        }
    }

    async getAvatar(userId: number): Promise<Avatar> {
        const user: User = await this.findUserByID(userId, ['avatar']);
        if (!user.avatar)
            throw new NotFoundException('User not found');
        return user.avatar;
    }

    async updateUsername(userId: number, username: string): Promise<User> {
        const user = await this.findUserByID(userId);
        const existingUser = await this.userRepository.findOne({
            where: { login: username },
        });
        if (existingUser && existingUser.id !== userId) {
            throw new BadRequestException(
                `Username "${username}" is already taken`,
            );
        }
        user.login = username;
        return this.userRepository.save(user);
    }

    async findUserByUsername(username: string): Promise<User | undefined> {
        return await this.userRepository.findOne({
            where: { login: username },
        });
    }

	async findFriends(userID: number): Promise<User[]> {
        const user = await this.userRepository.findOne({
            where: { id: userID },
			relations: ['friends'],
		}).catch((err) => {
            throw new BadRequestException(`Error fetching user with id ${userID}: ${err.message}`);
        });
        if (!user) {
            throw new BadRequestException(`User with id ${userID} not found`);
        }
        return user.friends;
	}
    
    async addFriend(userID: number, friendID: number): Promise<User> {
        if (userID === friendID) {
            throw new BadRequestException(`You can't add yourself as a friend`);
        }
        const user = await this.userRepository.findOne({
            where: { id: userID },
            relations: ['friends'],
        }).catch((err) => {
            throw new BadRequestException(err.message);
        });
        if (!user) {
            throw new BadRequestException(`User with id ${userID} not found`);
        }
        const friend = await this.userRepository.findOne({
            where: { id: friendID },
        }).catch((err) => {
            throw new BadRequestException(err.message);
        });
        if (!friend) {
            throw new BadRequestException(`User with id ${friendID} not found`);
        }
        if (user.friends.map((user) => user.id).includes(friendID)) {
            throw new BadRequestException(`${friend.login} is already your friend`);
        }
        user.friends.push(friend);
        await this.userRepository.save(user);
        return user;
    }
    
    async removeFriend(userID: number, friendID: number) {
        if (userID === friendID) {
            throw new BadRequestException(`You can't remove yourself as a friend`);
        }
        const user = await this.userRepository.findOne({
            where: { id: userID },
            relations: ['friends'],
        }).catch((err) => {
            throw new BadRequestException(err.message);
        });
        if (!user) {
            throw new BadRequestException(`User with id ${userID} not found`);
        }
        const friend = await this.userRepository.findOne({
            where: { id: friendID },
        }).catch((err) => {
            throw new BadRequestException(err.message);
        });
        if (!friend) {
            throw new BadRequestException(`User with id ${friendID} not found`);
        }
        if (!user.friends.map((user) => user.id).includes(friendID)) {
            throw new BadRequestException(`Cannot remove ${friend.login}. You are not friends yet.`);
        }
        user.friends = user.friends.filter((user) => user.id !== friendID);
        await this.userRepository.save(user);
        return user;
    }
    
    async blockUser(userId: number, blockedUserId: number): Promise<User> {
        if (userId === blockedUserId) {
            throw new BadRequestException(`You can't block yourself`);
        }
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['blockedUsers'],
        }).catch((err) => {
            throw new BadRequestException(err.message);
        });
        if (!user) {
            throw new BadRequestException(`User with id ${userId} not found`);
        }
        const blockedUser = await this.userRepository.findOne({
            where: { id: blockedUserId },
        }).catch((err) => {
            throw new BadRequestException(err.message);
        });
        if (!blockedUser) {
            throw new BadRequestException(`User with id ${blockedUserId} not found`);
        }
        if (user.blockedUsers.map((user) => user.id).includes(blockedUserId)) {
            throw new BadRequestException(`${blockedUser.login} is already blocked`);
        }
        user.blockedUsers.push(blockedUser);
        await this.userRepository.save(user);
        return user;
    }

    async unblockUser(userId: number, blockedUserId: number): Promise<User> {
        if (userId === blockedUserId) {
            throw new BadRequestException(`You can't unblock yourself`);
        }
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['blockedUsers'],
        }).catch((err) => {
            throw new BadRequestException(err.message);
        });
        if (!user) {
            throw new BadRequestException(`User with id ${userId} not found`);
        }
        const blockedUser = await this.userRepository.findOne({
            where: { id: blockedUserId },
        }).catch((err) => {
            throw new BadRequestException(err.message);
        });
        if (!blockedUser) {
            throw new BadRequestException(`User with id ${blockedUserId} not found`);
        }
        if (!user.blockedUsers.map((user) => user.id).includes(blockedUserId)) {
            throw new BadRequestException(`${blockedUser.login} is not blocked`);
        }
        user.blockedUsers = user.blockedUsers.filter(
            (user) => user.id !== blockedUserId,
        );
        await this.userRepository.save(user);
        return user;
    }
}
