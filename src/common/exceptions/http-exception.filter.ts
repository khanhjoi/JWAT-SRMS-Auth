import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpCommonException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';

@Catch(HttpException, HttpCommonException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpCommonException | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpCommonException) {
      const error = exception.toJson();
      response.status(error.statusCode).json(error);
      return;
    }

    const messageFromPipes: any = exception.getResponse();

    const statusCode = exception.getStatus();
    const cause = (exception.cause as { errorCode: number }) || {
      errorCode: 10001,
    };

    return response.status(statusCode).json({
      statusCode: statusCode,
      errorCode: messageFromPipes.message
        ? AuthErrorCode.INPUT_IS_NOT_VALID
        : cause.errorCode,
      message: messageFromPipes.message || exception.message,
      timeStamp: new Date().toISOString(),
    });
  }
}
