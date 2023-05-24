import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    Res,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { CreateUserDto } from 'src/user/dtos/CreateUser.dto'
import { UserService } from 'src/user/services/user/user.service'
import { FortyTwoAuthGuard } from '../../../auth/auth.guard'
import { User } from 'src/user/user.entity'
import { Response } from 'express'
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { AvatarService } from 'src/user/services/user/avatar.service'

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly avatarService: AvatarService
    ) {}

    @Get()
    async findAllUsers(): Promise<User[]> {
        try {
            const users = await this.userService.findAllUsers()
            return users
        } catch (err) {
            if (err instanceof HttpException) {
                throw new HttpException(err.message, err.getStatus())
            }
            throw err
        }
    }

    @Get('/friends')
    @UseGuards(FortyTwoAuthGuard)
    async getFriends(@Req() req: any) {
        try {
            const userID = req.session.user.id
            const Friends = await this.userService.findFriends(userID)
            return Friends
        } catch (err) {
            if (err instanceof HttpException) {
                throw new HttpException(err.message, err.getStatus())
            }
            throw err
        }
    }

    @Get('/friends/:id')
    @UseGuards(FortyTwoAuthGuard)
    async getFriendsById(@Param('id', ParseIntPipe) userID: number) {
        // const userID = req.session.user.id;
        try {
            const Friends = await this.userService.findFriends(userID)
            Friends.forEach((user) => console.log(user.login))
            return Friends
        } catch (err) {
            if (err instanceof HttpException) {
                throw new HttpException(err.message, err.getStatus())
            }
            throw err
        }
    }

    @Get(':id')
    @UseGuards(FortyTwoAuthGuard)
    async findUserByID(@Param('id', ParseIntPipe) id: number): Promise<User> {
        try {
            const user = await this.userService.findUserByID(id)
            return user
        } catch (e) {
            throw new BadRequestException('Invalid ID')
        }
    }

    @Post('username')
    @UseGuards(FortyTwoAuthGuard)
    async changeUsername(@Req() req, @Body('username') username: string): Promise<User> {
        try {
            req.session.user.login = username
            return await this.userService.changeUsername(req.session.user.id, username)
        } catch (err) {
            if (err instanceof HttpException) {
                throw new HttpException(err.message, err.getStatus())
            }
            throw err
        }
    }

    @Get(':id/avatar')
    @UseGuards(FortyTwoAuthGuard)
    async getAvatar(
        @Param('id', ParseIntPipe) id: number,
        @Res({ passthrough: true }) response: Response
    ): Promise<StreamableFile> {
        try {
            const avatar = await this.userService.getAvatar(id)
            response.set({
                'Content-Type': 'image/*',
                'Content-Disposition': 'inline; filename=${avatar.filename}'
            })
            return this.avatarService.toStreamableFile(avatar.data)
        } catch (err) {
            if (err instanceof HttpException) {
                throw new HttpException(err.message, err.getStatus())
            }
            throw err
        }
    }

    @Put(':id/avatar')
    @UseGuards(FortyTwoAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async updateAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Param('id', ParseIntPipe) id: number
    ): Promise<any> {
        try {
            await this.userService.setAvatar(id, file)
            return { status: 'success', message: 'Avatar updated successfully' }
        } catch (err) {
            if (err instanceof HttpException) {
                throw new HttpException(err.message, err.getStatus())
            }
            throw err
        }
    }

    @Put(':id/username')
    @UseGuards(FortyTwoAuthGuard)
    async updateUsername(
        @Param('id', ParseIntPipe) id: number,
        @Body('username') username: string
    ): Promise<User> {
        try {
            return await this.userService.updateUsername(id, username)
        } catch (err) {
            if (err instanceof HttpException) {
                throw new HttpException(err.message, err.getStatus())
            }
            throw err
        }
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async findOrCreate(@Body() createUserDto: CreateUserDto) {
        try {
            const { id, email, login } = createUserDto
            const user = await this.userService.findOrCreateUser(id, email, login)
            return user
        } catch (err) {
            if (err instanceof HttpException) {
                throw new HttpException(err.message, err.getStatus())
            }
            throw err
        }
    }

    @Delete(':id')
    async deleteUserByID(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.userService.deleteUser(id)
        } catch (err) {
            if (err instanceof HttpException) {
                throw new HttpException(err.message, err.getStatus())
            }
            throw err
        }
    }

    @Get('search/:username')
    @UseGuards(FortyTwoAuthGuard)
    async findUserByUsername(@Param('username') username: string) {
        try {
            const user = await this.userService.findUserByUsername(username)
            if (!user) {
                throw new HttpException('User not found', 404)
            }
            return user
        } catch (err) {
            if (err instanceof HttpException) {
                throw new HttpException(err.message, err.getStatus())
            }
            throw err
        }
    }

    @Post('friends/:id')
    @UseGuards(FortyTwoAuthGuard)
    async addFriend(@Param('id', ParseIntPipe) friendID: number, @Req() req: any) {
        const userID = req.session.user.id
        try {
            await this.userService.addFriend(userID, friendID)
            return await this.userService.addFriend(friendID, userID)
        } catch (error) {
            if (error instanceof HttpException) {
                throw new HttpException(error.message, error.getStatus())
            }
            throw error
        }
    }

    @Post('unfriend/:id')
    @UseGuards(FortyTwoAuthGuard)
    async removeFriend(@Param('id', ParseIntPipe) friendID: number, @Req() req: any) {
        try {
            const userID = req.session.user.id
            await this.userService.removeFriend(userID, friendID)
            return await this.userService.removeFriend(friendID, userID)
        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                throw new HttpException(error.message, error.getStatus())
            }
            throw error
        }
    }

    @Get('block/:id')
    @UseGuards(FortyTwoAuthGuard)
    async getBlockedUsers(@Param('id', ParseIntPipe) userID: number, @Req() req: any) {
        try {
            const userId = req.session.user.id
            return await this.userService.getBlockedUsers(userId)
        } catch (error) {
            if (error instanceof HttpException) {
                throw new HttpException(error.message, error.getStatus())
            }
            throw error
        }
    }

    @Post('block/:id')
    @UseGuards(FortyTwoAuthGuard)
    async blockUser(@Param('id', ParseIntPipe) friendID: number, @Req() req: any) {
        try {
            const userID = req.session.user.id
            return await this.userService.blockUser(userID, friendID)
        } catch (error) {
            if (error instanceof HttpException) {
                throw new HttpException(error.message, error.getStatus())
            }
            throw error
        }
    }

    @Post('unblock/:id')
    @UseGuards(FortyTwoAuthGuard)
    async unblockUser(@Param('id', ParseIntPipe) friendID: number, @Req() req: any) {
        try {
            const userID = req.session.user.id
            return await this.userService.unblockUser(userID, friendID)
        } catch (error) {
            if (error instanceof HttpException) {
                throw new HttpException(error.message, error.getStatus())
            }
            throw error
        }
    }
}
