import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { UsersService } from './users.service';

@Controller('auth/2fa')
export class TwoFactorAuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('generate')
  async generate(@Req() req) {
    const user = await this.usersService.findById(req.user.id); // retrieve user from the database
    if (!user) {
      throw new UnauthorizedException();
    }

    const { base32: secret } = speakeasy.generateSecret({ length: 20 });

    // save secret key to user's profile in the database
    user.twoFactorSecret = secret;
    await user.save();

    // generate QR code to display to the user
    const qrCodeUrl = speakeasy.otpauthURL({
      secret,
      label: `${user.username}'s 2FA`,
      issuer: 'Your Website',
    });

    return { secret, qrCodeUrl };
  }

  @Post('verify')
  async verify(@Body() { otp }: { otp: string }, @Req() req) {
    const user = await this.usersService.findById(req.user.id); // retrieve user from the database
    if (!user) {
      throw new UnauthorizedException();
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: otp,
    });

    if (!verified) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    // mark user as authenticated and return JWT token
    const token = this.authService.generateToken(user);
    return { token };
  }
}
