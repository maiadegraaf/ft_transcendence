import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
// import { UsersService } from '../users/services/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('42')
  @UseGuards(AuthGuard('42'))
  async login42(@Req() req, @Res() res) {
    console.log('log in successful');
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async callback42(@Req() req, @Res() res) {
    console.log(req.user.accessToken);
    await this.authService.newUser(
      req.user.user.id,
      req.user.user.login,
      req.user.user.email,
    );
    res.redirect('/Home');
    return req.user;
  }

  @Get('token')
  @UseGuards(AuthGuard('42'))
  async token(@Req() req) {
    console.log(req.user);
    // return req.user.user.accessToken;
  }
}
