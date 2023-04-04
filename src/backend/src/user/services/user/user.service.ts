import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {Channel} from "../../../chat/entities/channel.entity";
// import {Channel} from "../../../chat/entities/channel.entity";
// import { Post } from 'src/typeorm/entities/Post';
// import { Profile } from 'src/typeorm/entities/Profile';
// import { CreateUserParams, CreateUserPostParams, CreateUserProfileParams, UpdateUserParams } from 'src/utils/types';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>, // @InjectRepository(Profile) private profileRepository: Repository<Profile>, // @InjectRepository(Post) private postRepository: Repository<Post>,
    ) {}

    findAllUsers() {
        return this.userRepository.find();
        // return this.userRepository.find({ relations: ['profile',  ]}) //will show relation with get request. null if not defined
    }

    async findUserByID(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            return null;
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
            user = await this.userRepository.save({ id, email, login });
        }
        return user;
    }

    deleteUser(id: number) {
        return this.userRepository.delete({ id });
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

  async getChannelsByUserId(userId: number): Promise<any> {
    const user = await this.findUserByID(userId);
    // const user = await this.userRepository.findOne(userId, {
    //   relations: ['channels'],
    // });
    // user.channels;
    console.log(user.channels);
    return user.channels;
    // const channels = user.find
    // return user.channels;
  }

  async addChannelToUser(channel: Channel, userId: number): Promise<any> {
    // await this.userRepository.save(channel);
    const user = await this.getChannelsByUserId(userId);
    user.channel.push(channel);
    return await this.userRepository.save(user);
  }// createUser(userDetails: CreateUserParams) {
    //     const newUser = this.userRepository.create({ //not async so not need to await
    //         ...userDetails,
    //     });
    //     return this.userRepository.save(newUser); //returns promise so need to await in controller
    // }

    // '...updateUserDetails' will spread updateUserDatails. I user only updates username/email, only username/email will be updated
    // If username and email. then username AND email will be updated
    // updateUser(id: number, updateUserDetails: UpdateUserParams) {
    //     return this.userRepository.update({ id }, {...updateUserDetails });
    // }

    // //Hier kan je ook een aparte service voor maken
    // async createUserProfile(id: number, createUserProfileDetails: CreateUserProfileParams) {
    //     const user = await this.userRepository.findOneBy({ id });
    //     if (!user) {
    //         throw new HttpException('User not found. Cannot create Profile', HttpStatus.BAD_REQUEST,);
    //     }
    //     const newProfile = this.profileRepository.create(createUserProfileDetails);
    //     const savedProfile = await this.profileRepository.save(newProfile);
    //     user.profile = savedProfile;
    //     return this.userRepository.save(user);
    // }

    // async createUserPost(id: number, createUserPostDetails: CreateUserPostParams){
    //     const user = await this.userRepository.findOneBy({ id }); //could also use findUserByID
    //     if (!user) {
    //         throw new HttpException('User not found. Cannot create Profile', HttpStatus.BAD_REQUEST,);
    //     }
    //     // const newPost = this.postRepository.create(createUserPostDetails);
    //     const newPost = this.postRepository.create({ ...createUserPostDetails, user, }); //ensure that it relates to that user
    //     return this.postRepository.save(newPost);
    // }

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
        return this.userRepository.findOne({ where: { socketId } });
    }
}
