import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query, Req,
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
    
    @Get('/friends')
    @UseGuards(FortyTwoAuthGuard)
    async getFriends(
        @Req() req: any,
    ) {
        console.log(`test`);
        const userID = req.session.user.id;
        console.log(`userID: ${userID}`);
        console.log(`UserController: Searching for friends of user with id: ${userID}`);
        return await this.userService.findFriends(userID);
    }
    
    @Get(':id')
    @UseGuards(FortyTwoAuthGuard)
    async findUserByID(@Param('id', ParseIntPipe) id: number): Promise<User> {
        const user = await this.userService.findUserByID(id);
        return user;
    }

    @Post('username')
    @UseGuards(FortyTwoAuthGuard)
    async changeUsername(
        @Req() req,
        @Body('username') username: string,
    ): Promise<User> {
        req.session.user.login = username;
        return await this.userService.changeUsername(
            req.session.user.id,
            username,
        );
    }

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
        await this.userService.setAvatar(id, file);
    }

    @Put(':id/username')
    @UseGuards(FortyTwoAuthGuard)
    async updateUsername(
        @Param('id', ParseIntPipe) id: number,
        @Body('username') username: string,
        ): Promise<User> {
        try {
            return await this.userService.updateUsername(id, username);
        } catch (err) {
            if (err instanceof HttpException) {
                throw new HttpException(err.message, err.getStatus());
            }
            throw err;
        }
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

    @Get('search/:username')
    @UseGuards(FortyTwoAuthGuard)
    async findUserByUsername(@Param('username') username: string) {
        const user = await this.userService.findUserByUsername(username);    
        if (!user) {
            // return { message: 'User not found' };
            throw new HttpException('User not found', 404);
        }
        return user;
    }

    @Post('friends/:id')
    @UseGuards(FortyTwoAuthGuard)
    async addFriend(
        @Param('id', ParseIntPipe) friendID: number,
        @Req() req: any,
    ) {
        const userID = req.session.user.id;
        try {
            await this.userService.addFriend(userID, friendID);
            return await this.userService.addFriend(friendID, userID);
        } catch (error) {
            console.log(error);
        }
    }


    @Post('unfriend/:id')
    @UseGuards(FortyTwoAuthGuard)
    async removeFriend(
        @Param('id', ParseIntPipe) friendID: number,
        @Req() req: any,
    ) {
        const userID = req.session.user.id;
        try {
            await this.userService.removeFriend(userID, friendID);
            return await this.userService.removeFriend(friendID, userID);
        } catch (error) {
            console.log(error);
        }
    }

}
