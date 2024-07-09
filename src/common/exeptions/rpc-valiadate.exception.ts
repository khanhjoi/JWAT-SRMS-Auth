import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

/**
 * This is custom to throw exceptions between two service
 * @return {
 *  statusCode: number,
 *  message: string
 * }
 */
@Catch(HttpException, RpcException)
export class RpcValidationFilter implements ExceptionFilter {
  catch(exception: HttpException | RpcException, host: ArgumentsHost) {
    const context = host.switchToRpc();
    const response = context.getContext();

    let errorResponse: any;
    let statusCode: any = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      errorResponse = exception.getResponse();
      statusCode = exception.getStatus();
    } else if (exception instanceof RpcException) {
      const error = exception.getError();
      if (
        typeof error === 'object' &&
        'message' in error &&
        'statusCode' in error
      ) {
        errorResponse = error.message;
        statusCode = error.statusCode;
      } else {
        errorResponse = error;
      }
    }

    return {
      statusCode: statusCode,
      message: errorResponse,
    };
  }
}
