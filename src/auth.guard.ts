import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtUtils } from './utils/JwtUtils.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtUtils) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers?.authorization?.replace('Bearer ', '')?.trim();

    const isActive = this.jwt.verifyToken('access_token', token);

    if (!isActive) {
      return false;
    }

    req.user = {
      id: isActive.id,
      email: isActive.email,
    };
    return true;
  }
}
