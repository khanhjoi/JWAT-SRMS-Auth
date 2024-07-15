import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomValidationPipe } from './common/pipes/validationpipe';

async function bootstrap() {
  const tcpMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
    });

  tcpMicroservice.useGlobalPipes(new CustomValidationPipe());

  tcpMicroservice.listen();
}
bootstrap();
