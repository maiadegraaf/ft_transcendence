import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>,
    ){}
    
    findAllUsers() {
        return this.userRepository.find()
        // return this.userRepository.find(parameters zetten)
    }
    
    async findUserByID(id: number){
        const user = await this.userRepository.findOne({ where : { id }});
        if (!user){
            throw new NotFoundException('User with ID ${id} not found');
        }
        return user;
    }

    createUser(userDetails: CreateUserParams) {
        const newUser = this.userRepository.create({ //not async so not need to await
            ...userDetails,
        });
        return this.userRepository.save(newUser); //returns promise so need to await in controller
    }
}
