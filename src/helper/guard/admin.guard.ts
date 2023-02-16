import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IAuthUser } from 'src/auth/interfaces/auth.interface';

export class JwtAdminGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: IAuthUser = request.user;
    return user.type >= 3;
  }
}
