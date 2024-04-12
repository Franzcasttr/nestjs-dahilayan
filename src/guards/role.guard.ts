import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
// import { Observable } from 'rxjs';
import { FirebaseAdmin } from 'src/config/firebase.setup';
// import { Roles } from 'src/decorators/role.decorator';

// const fakeUser = {
//   name: 'Ubat',
//   roles: ['Admin', 'SuperAdmin', 'User'],
// };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly admin: FirebaseAdmin,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const app = this.admin.setup();
    // const requiredRoles = this.reflector.get(Roles, context.getHandler());
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.split('Bearer ')[1];
    if (!token) return false;

    try {
      const claims = await app.auth().verifyIdToken(token);

      if (claims.permissions === permissions[0]) {
        return true;
      }
      throw new UnauthorizedException();
    } catch (error) {
      console.log('Error', error);
      throw new UnauthorizedException();
    }
    // return false;
  }
}
