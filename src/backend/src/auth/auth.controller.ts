import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('42')
  @UseGuards(AuthGuard('42'))
  async login42(@Req() req, @Res() res) {
    // This method will redirect the user to the 42 authentication page
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async callback42(@Req() req) {
    // This method will be called after the authentication is successful
    // You can access the authenticated user object with the `req.user` property
    return req.user;
  }
}
