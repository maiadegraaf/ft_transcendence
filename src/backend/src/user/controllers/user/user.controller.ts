import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dtos/CreateUser.dto';
import { UserService } from 'src/user/services/user/user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAllUsers() {
    const users = await this.userService.findAllUsers();
    return users;
  }

  @Get(':id')
  async findUserByID(@Param('id') id: number) {
    const user = await this.userService.findUserByID(id);
    return user;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async findOrCreate(@Body() createUserDto: CreateUserDto) {
    const { id, email, login } = createUserDto;
    const user = await this.userService.findOrCreateUser(id, email, login);
    return user;
  }

  @Delete(':id')
  async deleteUserByID(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }

  // @Put(':id')
  // async updateUserByID(
  //     @Param('id', ParseIntPipe) id: number,
  //     @Body() updateUserDto: UpdateUserDto,
  // ) {
  //     await this.userService.updateUser(id, updateUserDto);
  // }

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
