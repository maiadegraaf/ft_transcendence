import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('42')
  @UseGuards(FortyTwoAuthGuard)
  async login42(@Req() req, @Res() res) {}

  @Get('42/callback')
  @UseGuards(FortyTwoAuthGuard)
  async callback42(@Req() req, @Res() res) {
    req.session.user = req.user;
    res.redirect(`/2fa`);
  }

  @Get('profile')
  async profile(@Req() req) {
    return req.session.user;
  }
}
