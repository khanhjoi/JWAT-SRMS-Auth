import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptor/Logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { UnknownExceptionsFilter } from './common/exceptions/unknown-exception.filter';
import { RpcValidationFilter } from './common/exceptions/rpc-exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ReflectionService } from '@grpc/reflection';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(
        __dirname,
        '../../node_modules/@khanhjoi/protos/auth.proto',
      ),
      url: 'localhost:8081',
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server);
      },
    },
  });

  // inception filter
  app.useGlobalFilters(new UnknownExceptionsFilter());
  app.useGlobalFilters(new RpcValidationFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap();
