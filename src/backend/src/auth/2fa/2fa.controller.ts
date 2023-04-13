import {
    ClassSerializerInterceptor,
    Controller,
    Post,
    UseInterceptors,
    Req,
    Body,
    UseGuards,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './2fa.service';
import { FortyTwoAuthGuard } from '../auth.guard';
import { UserService } from '../../user/services/user/user.service';
import { authenticator } from 'otplib';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
    constructor(
        private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
        private userService: UserService,
    ) {}

    @Post('generate')
    async generate2FASecret(
        @Req() req,
    ): Promise<{ url: string; secret: string }> {
        let secret;
        if (req.session.user.twoFactorAuthenticationSecret)
            secret = req.session.user.twoFactorAuthenticationSecret;
        else secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(
            req.session.user.login,
            'ft_transcendence',
            secret,
        );

        if (!req.session.user.twoFactorAuthenticationSecret) {
            await this.userService.setTwoFactorAuthenticationSecret(
                secret,
                req.session.user.id,
            );
            await this.userService.turnOnTwoFactorAuthentication(
                req.session.user.id,
            );
        }

        return {
            secret: secret,
            url: otpauthUrl,
        };
    }

    @Post('verify')
    async verifyTwoFactorToken(
        @Req() req,
        @Body('token') token: string,
    ): Promise<boolean> {
        const userFound = await this.userService.findUserByID(
            req.session.user.id,
        );
        if (!userFound) {
            return false;
        }
        console.log(token);
        console.log(req.session.user.twoFactorAuthenticationSecret);
        const isTokenValid = authenticator.verify({
            token,
            secret: req.session.user.twoFactorAuthenticationSecret,
        });
        console.log(isTokenValid);
        return isTokenValid;
    }
}
