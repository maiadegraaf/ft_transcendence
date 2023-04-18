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
    Res,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dtos/CreateUser.dto';
import { UserService } from 'src/user/services/user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { FortyTwoAuthGuard } from '../../../auth/auth.guard';
import { User } from 'src/user/user.entity';
import { Response } from 'express';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarService } from 'src/user/services/user/avatar.service';


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly avatarService: AvatarService,
        ) {}

    @Get()
    async findAllUsers(): Promise<User[]> {
        const users = await this.userService.findAllUsers();
        return users;
    }

    @Get(':id')
    @UseGuards(FortyTwoAuthGuard)
    async findUserByID(@Param('id', ParseIntPipe) id: number): Promise<User> {
        const user = await this.userService.findUserByID(id);
        return user;
    }

    // @Get(':me')
    // @UseGuards(FortyTwoAuthGuard)
    // async findUserByID(@Req() req: Request): Promise<User> {
    //     const user = await this.userService.findUserByID(req.user.userID);
    //     return (user);
    // }

    @Get(':id/avatar')
    @UseGuards(FortyTwoAuthGuard)
    async getAvatar(
        @Param('id', ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response,
    ): Promise<StreamableFile> {
        const avatar = await this.userService.getAvatar(id);
        response.set({
            'Content-Type': 'image/*',
            'Content-Disposition': 'inline; filename=${avatar.filename}',
        });
        return this.avatarService.toStreamableFile(avatar.data);
    }

    @Put(':id/avatar')
    @UseGuards(FortyTwoAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async updateAvatar(
        @UploadedFile() file: Express.Multer.File, 
        @Param('id', ParseIntPipe) id: number,
        ): Promise<void> {
        return this.userService.setAvatar(id, file);
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
