import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { defaultIfEmpty, tap } from 'rxjs/operators';

/**
 * TODO PROPERLY ATTRIBUTE
 * https://stackoverflow.com/a/60669415
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
