import { Controller, Post, Body } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from '../service/user.service';

// We define a new controller with the @Controller() decorator,
// which specifies the base route for all the endpoints defined in this controller.
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

// We define a new endpoint for creating a user with the @Post() decorator. 
// This endpoint accepts a user object in the request body with the @Body() decorator.
  @Post()
  async createUser(@Body() user: User) {
    return await this.userService.createUser(user);
    // return await this.userService.createUser(user);
  }
}