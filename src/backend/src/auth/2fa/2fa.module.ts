import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationController } from './2fa.controller';
import { UserService } from '../../user/services/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService],
    controllers: [TwoFactorAuthenticationController],
})
export class TwoFAModule {}
