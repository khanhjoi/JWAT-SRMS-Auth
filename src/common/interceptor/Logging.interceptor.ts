import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    
    this.logger.verbose(`Request URL Before call handle(): ${request.url}`)

    return next.handle().pipe(
      tap(() =>  this.logger.log(`Response sent when calling handle() for: ${request.url}`)),
    );
  }
}
