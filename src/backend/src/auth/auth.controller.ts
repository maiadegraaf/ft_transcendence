import {
    Controller,
    Get,
    HttpStatus,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedGuard, FortyTwoAuthGuard } from './auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('42')
    @UseGuards(AuthGuard('42'))
    async login42() {}

    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async callback42(@Req() req, @Res() res) {
        req.session.user = req.user;
        res.redirect('/Home');
    }

    @Get('profile')
    @UseGuards(FortyTwoAuthGuard)
    async getProfile(@Req() req) {
        const user = req.session.user;
        return user;
    }

    @Get('logout')
    async logout(@Req() req) {
        console.log('before', req.session);
        req.session.destroy();
        console.log('after', req.session);
        return 'Logged out';
    }
}
