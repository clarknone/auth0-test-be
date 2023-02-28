import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IAuthUser } from 'src/auth/interfaces/auth.interface';

export class JwtAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: IAuthUser = request.user;
    return user.role?.includes('admin');
  }
}
