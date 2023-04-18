import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../../user/services/user/user.service';

@Injectable()
export class UserGroupGard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.session.user;
        const params = request.params;
        const id = params.id;
        if (id == user.id) {
            return true;
        }
        return false;
    }
}
