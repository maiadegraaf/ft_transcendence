import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user/user.service';
import { authenticator } from 'otplib';
import { Response } from 'express';
import { User } from '../../user/user.entity';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(private userService: UserService) {}

  // public isTwoFactorAuthenticationCodeValid(
  //   twoFactorAuthenticationCode: string,
  //   user: User,
  // ) {
  //   return authenticator.verify({
  //     token: twoFactorAuthenticationCode,
  //     secret: user.twoFactorAuthenticationSecret,
  //   });
  // }

  // async generateQrCodeDataURL(otpAuthUrl: string) {
  //   return toDataURL(otpAuthUrl);
  // }
}
