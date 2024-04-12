import {
  CallHandler,
  ExecutionContext,
  HttpException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

export class DeleteUserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(
        catchError(() =>
          throwError(
            () =>
              new HttpException(
                'Something went wrong please try again later!',
                500,
              ),
          ),
        ),
      );
  }
}
