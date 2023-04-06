import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Req,
  Body, UseGuards,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './2fa.service';
import { Response } from 'express';
import { FortyTwoAuthGuard } from '../auth.guard';
import { UserService } from '../../user/services/user/user.service';
import {User} from "../../user/user.entity";
import {authenticator} from "otplib";
import * as qrcode from 'qrcode';
import {use} from "passport";

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private userService: UserService,
  ) {}

  @Post('generate')
  // @UseGuards(FortyTwoAuthGuard)
  async generate2FASecret(@Req() req): Promise<{ url: string; secret: string }> {
    const secret = authenticator.generateSecret();
    const url = authenticator.keyuri(req.session.user.login , 'ft_transcendence', secret);

    if (!req.session.user.twoFactorAuthenticationSecret)
    {
      await this.userService.setTwoFactorAuthenticationSecret(secret, req.session.user.id);
      await this.userService.turnOnTwoFactorAuthentication(req.session.user.id);
    }

    return {
      secret: secret,
      url: url
    };
  }

  @Post('verify')
  async verifyTwoFactorToken(@Req() req, @Body('token') token: string): Promise<boolean> {
    const userFound = await this.userService.findUserByID(req.session.user.id);
    if (!userFound) {
      return false;
    }
    console.log(token);
    const isTokenValid = authenticator.verify({ token: token, secret: req.session.user.twoFactorAuthenticationSecret });
    console.log(isTokenValid);
    return isTokenValid;
  }
}
