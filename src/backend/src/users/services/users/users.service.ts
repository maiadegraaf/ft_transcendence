import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/users.entity';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { Channel } from '../../../chat/entities/channel.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findAllUsers() {
    return this.userRepository.find();
    // return this.userRepository.find(parameters zetten)
  }

  async findUserByID(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User with ID ${id} not found');
    }
    return user;
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      //not async so not need to await
      ...userDetails,
    });
    return this.userRepository.save(newUser); //returns promise so need to await in controller
  }

  // '...updateUserDetails' will spread updateUserDatails. I user only updates username/email, only username/email will be updated
  // If username and email. then username AND email will be updated
  updateUser(id: number, updateUserDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  async getUserByName(userName: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username: userName },
    });
    return user;
  }

  // async addChannelToUser(userId: number, channelId: number): Promise<any> {
  //   const user = await this.findUserByID(userId);
  //   const channel = await this.channelRepository.findOne({
  //     where: { id: channelId },
  //     relations: ['users'],
  //   });
  //
  //
  // }

  async saveUser(user: User): Promise<any> {
    return this.userRepository.save(user);
  }
}
