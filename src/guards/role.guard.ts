import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { FirebaseAdmin } from 'src/config/firebase.setup';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly admin: FirebaseAdmin,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const app = this.admin.setup();

    const permissions = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.split('Bearer ')[1];
    if (!token) return false;

    try {
      const claims = await app.auth().verifyIdToken(token);

      if (claims.roles.some((role: string) => permissions.includes(role))) {
        return true;
      }
    } catch (error) {
      console.log('Error', error);
      throw new UnauthorizedException(
        'Something went wrong please try again later!',
      );
    }
  }
}
