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

  // Get /api/auth/42/callback
  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async callback42(@Req() req, @Res() res) {
    res.redirect('/Home');
    console.log(req.user.profile._json.login);
    await this.authService.newUser(req.user.profile._json);
  }
}
