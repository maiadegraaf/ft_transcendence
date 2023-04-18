import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { AvatarService } from './services/user/avatar.service';
import { Avatar } from './avatar.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Avatar])],
    controllers: [UserController],
    providers: [UserService, AvatarService],
})
export class UserModule {}
