import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (request.session.user?.isTwoFactorAuthenticationEnabled) {
            if (request.session.user && request.session.isAuthenticated) {
                return true;
            }
        } else if (
            request.session.user?.isTwoFactorAuthenticationEnabled == false &&
            request.session.user
        ) {
            return true;
        }
        return false;
    }
}
