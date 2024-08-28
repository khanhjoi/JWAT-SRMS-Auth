import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { timestamp } from 'rxjs';

@Catch()
export class UnknownExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it he
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorCode: 0,
      message: 'Internal Server Error',
      timestamp: new Date().toISOString(),
    });
  }
}
