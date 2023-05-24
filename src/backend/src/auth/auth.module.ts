import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { FortyTwoStrategy } from './auth.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/user.entity'
import { UserService } from '../user/services/user/user.service'
import { Repository } from 'typeorm'
import { SessionSerializer } from './session.serializer'
import { AvatarService } from 'src/user/services/user/avatar.service'
import { Avatar } from 'src/user/avatar.entity'

@Module({
    imports: [PassportModule.register({ session: true }), TypeOrmModule.forFeature([User, Avatar])],
    providers: [FortyTwoStrategy, AuthService, UserService, SessionSerializer, AvatarService],
    controllers: [AuthController]
})
export class AuthModule {}
