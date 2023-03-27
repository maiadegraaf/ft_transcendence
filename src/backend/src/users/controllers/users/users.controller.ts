import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}
    @Get()
    getUsers(){}

    @Post()
    createUser(@Body() CreateUserDto: CreateUserDto) {
        // const { ...userDetails, confirmPassword } = CreateUserDto; 
        // //takes confirmPassword out of the object and all other properties are set in userDetails
        // this.usersService.createUser(userDetails);
        return this.usersService.createUser(CreateUserDto);
    }
}
