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
            clientID:
                'u-s4t2ud-43ce865ead13681d00d684457fd09e030cd0de64b10bdd7ab171af1030c9bfbf',
            clientSecret:
                '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',
            callbackURL: 'http://localhost:8080/api/auth/42/callback',
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
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
        if ((await this.authService.validateUser(accessToken, id)) == true)
            done(null, user);
        else done('Unauthorized', false);
    }
}
