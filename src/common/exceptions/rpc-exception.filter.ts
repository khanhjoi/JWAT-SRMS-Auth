import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export type ErrorMessageType = {
  statusCode: number;
  errors: string | string[];
};

@Catch(RpcException)
export class RpcValidationFilter implements RpcExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    return throwError(() => new BadRequestException('Invalid'));
  }
}
