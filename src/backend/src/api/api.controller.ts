import { Controller, Get } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Controller('auth')
export class ApiController {
    constructor(private authService: AuthService) {}

    @Get()
    getAuthService(): AuthService {
        return this.authService;
    }
}