import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { CreateUserDto } from '../dto/create-user.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<CreateUserDto>,
  ): Observable<any> {
    return next.handle().pipe(map((data) => instanceToPlain(data)));
  }
}
