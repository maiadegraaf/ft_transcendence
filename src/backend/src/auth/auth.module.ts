import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './auth.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/services/user/user.service';
import { Repository } from 'typeorm';
import { SessionSerializer } from './session.serializer';

@Module({
    imports: [
        PassportModule.register({ session: true }),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [FortyTwoStrategy, AuthService, UserService, SessionSerializer],
    controllers: [AuthController],
})
export class AuthModule {}
