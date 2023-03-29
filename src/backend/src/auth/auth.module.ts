import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './auth.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/services/user/user.service';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User])],
  providers: [FortyTwoStrategy, AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
