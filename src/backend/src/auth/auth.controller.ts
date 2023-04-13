import {Controller, Get, HttpStatus, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthenticatedGuard, FortyTwoAuthGuard} from './auth.guard';
import { AuthGuard } from '@nestjs/passport';
import * as passport from 'passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('42')
    @UseGuards(AuthGuard('42'))
    async login42() {}

    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async callback42(@Req() req, @Res() res) {
        console.log('req', req);
        if (req.header('Referer') == 'http://localhost:8080/') {
            res.redirect('/Home');
        } else {
            res.redirect(req.header('Referer') || '/');
        }
    }

    @Get('profile')
    @UseGuards(AuthenticatedGuard)
    async getProfile(@Req() req) {
        console.log('req2', req.user);

        try {
            const user = req.user;
            return user;
        } catch (error) {
            console.error(error);
            return 'error';
        }
    }
}
