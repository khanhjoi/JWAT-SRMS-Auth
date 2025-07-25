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
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      'http://localhost:4000',
    ],
    credentials: true,
    methods: ['*'],
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(
        __dirname,
        '../../node_modules/@khanhjoi/protos/auth.proto',
      ),
      url: `${process.env.AUTH_SERVICE_HOST || "localhost"}:8081`, 
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
