import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('pong')
export class PongController {
    @Get('profile')
    getProfile(@Req() req: Request) {
        // const session_user_id = req.session.session_user_id;
        // if (!session_user_id) {
        //     return { error: 'Not logged in' };
        // }
        // const userId = JSON.parse(session_user_id).value;
        // return { userId };
    }
}
