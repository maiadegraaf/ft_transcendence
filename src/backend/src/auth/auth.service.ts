import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './auth.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: '42' })],
  providers: [FortyTwoStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
