import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Based on
 * Lafarie, M. (2020) Decorator to return not found in a
 *          NestJS Controller [Source code]. https://stackoverflow.com/a/60669415
 */
@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  constructor(@Optional() private errorMessage?: string) {}

  intercept(context: ExecutionContext, stream$: CallHandler): Observable<any> {
    return stream$.handle().pipe(
      tap((data) => {
        if (data === undefined || data === null) {
          throw new NotFoundException(this.errorMessage);
        }
      }),
    );
  }
}
