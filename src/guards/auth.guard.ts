import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
// import { Observable } from 'rxjs';
import { FirebaseAdmin } from 'src/config/firebase.setup';

interface CustomRequest<T = any> extends Request {
  claims?: DecodedIdToken;
  body: T;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly admin: FirebaseAdmin) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const app = this.admin.setup();
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const token = request.headers['authorization']?.split('Bearer ')[1];
    if (!token)
      throw new UnauthorizedException(
        `You're not allowed to access this routes`,
      );

    try {
      const claims = await app.auth().verifyIdToken(token);
      if (claims.uid) {
        request.claims = claims;
        return true;
      }
    } catch (error) {
      console.log('Error', error);
      throw new BadRequestException(
        'Something went wrong please try again later!',
      );
    }
  }
}
