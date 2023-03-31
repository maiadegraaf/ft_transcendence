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
    const user = req.user;
    res.cookie('user', JSON.stringify(user), {
      maxAge: 3600000
    });
    res.redirect(`/Home`);
  }
}
