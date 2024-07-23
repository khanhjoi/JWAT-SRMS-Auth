import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export type ErrorMessageType = {
  statusCode: number;
  errors: string | string[];
};

@Catch()
export class RpcValidationFilter implements RpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    const errorMessage: ErrorMessageType = {
      statusCode: exception?.error?.statusCode || HttpStatus.BAD_REQUEST,
      errors: exception?.response?.messages || exception?.error?.message,
    };

    return throwError(
      () => new RpcException({ message: JSON.stringify(errorMessage) }),
    );
  }
}
