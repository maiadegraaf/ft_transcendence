import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
// import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
// import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Get()
    async findAllUsers(){
        const users = await this.usersService.findAllUsers();
        return users;
    }

    @Get(':id')
    async findUserByID(@Param('id') id: number){
        const users = await this.usersService.findUserByID(id);
        return users;
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createUser(@Body() CreateUserDto: CreateUserDto) {
        return this.usersService.createUser(CreateUserDto);
    }

    @Put(':id')
    async updateUserByID(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
        ){
        await this.usersService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUserByID(@Param('id', ParseIntPipe) id: number) {
        await this.usersService.deleteUser(id);
    }

    // @Post()
    // async findOrCreateUser(

    // )














    // // Below endpoints should be better if they have their own controller

    // // Example of ONE-TO-ONE RELATIONSHIP
    // //typicaly authentication and you get user id with the request.user object
    // //in stead of pass it in the route, you grep it from the session
    // //but we are not using sessions yet
    // @Post(':id/profiles')
    // createUserProfile(@Param('id', ParseIntPipe) id: number, @Body() CreateUserProfileDto: CreateUserProfileDto) {
    //     return this.usersService.createUserProfile(id, CreateUserProfileDto);
    // }

    // @Post(':id/posts')
    // createUserPost(@Param('id', ParseIntPipe) id: number, @Body() CreateUserPostDto: CreateUserPostDto,){
    //     return this.usersService.createUserPost(id, CreateUserPostDto);
    // }
}
