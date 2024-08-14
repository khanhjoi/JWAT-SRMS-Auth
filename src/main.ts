import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/intercepter/Logging.intercepter';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/htpp-exception.filter';
import { UnknownExceptionsFilter } from './common/exceptions/unknow-exception.filter';
import { RpcValidationFilter } from './common/exceptions/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const tcpMicroservice =
  //   await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //     transport: Transport.GRPC,
  //     options: {
  //       package: 'auth',
  //       url: 'localhost:50001',
  //       protoPath: join(__dirname, '../proto/auth.proto'),
  //     },
  //   });

  // tcpMicroservice.useGlobalPipes(new CustomValidationPipe());
  // tcpMicroservice.listen();
  app.useGlobalFilters(new UnknownExceptionsFilter());
  app.useGlobalFilters(new RpcValidationFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  app.listen(3001);
}

bootstrap();
