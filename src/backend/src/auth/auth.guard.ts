import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import passport from 'passport';
import {Observable} from "rxjs";

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        console.log('request', request.session.user);
        return true;
    }
}

@Injectable()
export class AuthenticatedGuard extends AuthGuard('42') implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }
}
