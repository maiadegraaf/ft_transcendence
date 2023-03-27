import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        JwtModule.register({
            secret: 'yourSecretKey',
            signOptions: { expiresIn: '1d' },
        }),
        TypeOrmModule.forFeature([User])
    ],
    controllers: [ApiController],
    providers: [AuthService, UserService],
})
export class ApiModule {}