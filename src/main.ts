import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './common/pipes/validationpipe';
import { join } from 'path';

async function bootstrap() {
  const tcpMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        url: 'localhost:50001',
        protoPath: join(__dirname, '../proto/auth.proto'),
      },
    });

  tcpMicroservice.useGlobalPipes(new CustomValidationPipe());

  tcpMicroservice.listen();
}
bootstrap();
