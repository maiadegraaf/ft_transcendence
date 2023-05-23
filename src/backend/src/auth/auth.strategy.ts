import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from './auth.service';
import { UserService } from '../user/services/user/user.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) {
        super({
            clientID: process.env.FORTYTWO_APP_ID,
            clientSecret: process.env.FORTYTWO_APP_SECRET,
            callbackURL: process.env.FORTYTWO_APP_REDIRECT_URL,
            scope: ['public'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any,
    ): Promise<any> {
        const { id, login, email } = profile._json;
        const find = await this.userService.findOrCreateUser(id, email, login);
        const user = {
            id: id,
            login: find.login,
            email: find.email,
            isTwoFactorAuthenticationEnabled:
                find.isTwoFactorAuthenticationEnabled,
            twoFactorAuthenticationSecret: find.twoFactorAuthenticationSecret,
            // accessToken: accessToken,
            // refreshToken: refreshToken,
        };
        if ((await this.authService.validateUser(accessToken, id)) == true)
            done(null, user);
        else done('Unauthorized', false);
    }
}
