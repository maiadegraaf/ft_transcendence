import {
  ClassSerializerInterceptor,
  Controller,
  Header,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  Req,
  UnauthorizedException,
  Body,
  HttpCode,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './2fa.service';
import { Response } from 'express';
import { FortyTwoAuthGuard } from '../auth.guard';
import { UserService } from '../../user/services/user/user.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private userService: UserService,
  ) {}

  @Post('turn-on')
  @UseGuards(FortyTwoAuthGuard)
  async turnOnTwoFactorAuthentication(@Req() request, @Body() body) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        body.twoFactorAuthenticationCode,
        request.session.user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.userService.turnOnTwoFactorAuthentication(
      request.session.user.id,
    );
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(FortyTwoAuthGuard)
  async authenticate(@Req() request, @Body() body) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        body.twoFactorAuthenticationCode,
        request.user,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    return this.twoFactorAuthenticationService.loginWith2fa(request.user);
  }

  @Post('generate')
  @UseGuards(FortyTwoAuthGuard)
  async register(@Res() response: Response, @Req() req) {
    console.log('otpauthUrl');
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generate2FASecret(
        req.session.user,
      );

    return this.twoFactorAuthenticationService.generateQrCodeDataURL(
      otpauthUrl,
    );
  }
}
