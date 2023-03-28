import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: process.env['FORTYTWO_APP_ID '],
      clientSecret: process.env['FORTYTWO_APP_SECRET'],
      callbackURL: 'http://localhost:8080/auth/42/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    // Here you can validate the user's credentials and retrieve the user's profile information from the 42 API
    done(null, profile);
  }
}
