import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './auth.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/services/users/users.service';
import { User } from '../users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User])],
  providers: [FortyTwoStrategy, AuthService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
