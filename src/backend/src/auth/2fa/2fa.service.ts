import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user/user.service';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { Response } from 'express';
import { User } from '../../user/user.entity';

@Injectable()
export class TwoFactorAuthenticationService {
    constructor(private userService: UserService) {}

    public isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode: string,
        user: User,
    ) {
        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user.twoFactorAuthenticationSecret,
        });
    }

    async generate2FASecret(user: User) {
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(user.email, '2FA_APP', secret);

        await this.userService.setTwoFactorAuthenticationSecret(
            secret,
            user.id,
        );

        return {
            secret,
            otpauthUrl,
        };
    }

    async generateQrCodeDataURL(otpAuthUrl: string) {
        return toDataURL(otpAuthUrl);
    }
}
