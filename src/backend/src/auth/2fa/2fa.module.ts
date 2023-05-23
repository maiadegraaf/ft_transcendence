import { Module } from '@nestjs/common'
import { TwoFactorAuthenticationController } from './2fa.controller'
import { UserService } from '../../user/services/user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../user/user.entity'
import { AvatarService } from 'src/user/services/user/avatar.service'
import { Avatar } from 'src/user/avatar.entity'

@Module({
    imports: [TypeOrmModule.forFeature([User, Avatar])],
    providers: [UserService, AvatarService],
    controllers: [TwoFactorAuthenticationController]
})
export class TwoFAModule {}
