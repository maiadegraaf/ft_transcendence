import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import { Post } from 'src/typeorm/entities/Post';
// import { Profile } from 'src/typeorm/entities/Profile';
// import { CreateUserParams, CreateUserPostParams, CreateUserProfileParams, UpdateUserParams } from 'src/utils/types';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
                // @InjectRepository(Profile) private profileRepository: Repository<Profile>,
                // @InjectRepository(Post) private postRepository: Repository<Post>,
    ){}
    
    findAllUsers() {
        return this.userRepository.find();
        // return this.userRepository.find({ relations: ['profile',  ]}) //will show relation with get request. null if not defined
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

    // '...updateUserDetails' will spread updateUserDatails. I user only updates username/email, only username/email will be updated
    // If username and email. then username AND email will be updated
    updateUser(id: number, updateUserDetails: UpdateUserParams) {
        return this.userRepository.update({ id }, {...updateUserDetails });
    }

    deleteUser(id: number) {
        return this.userRepository.delete({ id });
    }

    // async findOrCreateUser(id: number, email: string, login_name: string): Promise<User>{
    //     let user = await this.userRepository.findOne({ where : { id }} );
    //     if (!user) {
    //         user = await this.userRepository.save({ id, email, login_name});
    //     }
    //     return user;
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
}
