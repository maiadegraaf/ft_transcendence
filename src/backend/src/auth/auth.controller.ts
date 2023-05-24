import {
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Req,
    Res,
    UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { FortyTwoAuthGuard } from './auth.guard'
import { AuthGuard } from '@nestjs/passport'
import { UserService } from '../user/services/user/user.service'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) {}

    @Get('42')
    @UseGuards(AuthGuard('42'))
    async login42() {}

    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async callback42(@Req() req, @Res() res) {
        const twoFactorAuthenticationSecret = req.user.twoFactorAuthenticationSecret
        delete req.user.twoFactorAuthenticationSecret
        req.session.user = req.user
        req.session.twoFactorAuthenticationSecret = twoFactorAuthenticationSecret
        if (req.session.user.isTwoFactorAuthenticationEnabled)
            res.redirect(req.protocol + '://' + req.headers.host + '/2fa/create')
        else {
            res.redirect(req.protocol + '://' + req.headers.host + '/2fa')
        }
    }

    @Get('profile')
    @UseGuards(FortyTwoAuthGuard)
    async getProfile(@Req() req) {
        const user = req.session.user
        return user
    }

    @Get('profile/:id')
    async getProfileFake(@Param('id', ParseIntPipe) id: number, @Req() req, @Res() res) {
        try {
            const user = await this.userService.findOrCreateUser(
                id,
                'user' + id + '@gmail.com',
                'user' + id
            )
            console.log('id test : ', id)
            req.session.user = user
            if (req.session.user.isTwoFactorAuthenticationEnabled) res.redirect('/2fa/create')
            else {
                res.redirect('/2fa')
            }
        } catch {
            return res.status(HttpStatus.BAD_REQUEST).send('Invalid ID')
        }
    }

    @Get('logout')
    async logout(@Req() req) {
        req.session.destroy()
        return 'Logged out'
    }
}
