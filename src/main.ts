import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const tcpMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      // ---- for docker deployment
      // options: {
      //   host: process.env.AUTH_SERVICE_HOST || '0.0.0.0',
      //   port: parseInt(process.env.AUTH_SERVICE_PORT, 10),
      // },
      options: {
        host: 'localhost',
        port: 3001,
      },
    });

  tcpMicroservice.useGlobalPipes(new ValidationPipe());

  tcpMicroservice.listen();
}
bootstrap();
