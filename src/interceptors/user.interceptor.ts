import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { instanceToPlain } from 'class-transformer';
import { FirebaseAdmin } from 'src/config/firebase.setup';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly admin: FirebaseAdmin) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const app = this.admin.setup();
    const request = context.switchToHttp().getRequest();

    try {
      const user = await app.auth().getUser(request.claims.uid);
      request.currentUser = user;
    } catch (error) {
      console.log('Error', error);
      throw new BadRequestException();
    }
    return next.handle().pipe(map((data) => instanceToPlain(data)));
  }
}
