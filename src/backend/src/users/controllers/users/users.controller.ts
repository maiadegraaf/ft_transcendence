import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}
    @Get()
    async findAllUsers(){
        const users = await this.usersService.findAllUsers();
        return users;
    }
    // @Get()
    // getUsers(){
    //     return this.usersService.findUsers();
    // }

    @Get(':id')
    async findUserByID(@Param('id') id: number){
        const users = await this.usersService.findUserByID(id);
        return users;
    }

    @Post()
    createUser(@Body() CreateUserDto: CreateUserDto) {
        // const { ...userDetails, confirmPassword } = CreateUserDto; 
        // //takes confirmPassword out of the object and all other properties are set in userDetails
        // this.usersService.createUser(userDetails);
        return this.usersService.createUser(CreateUserDto);
    }
}
