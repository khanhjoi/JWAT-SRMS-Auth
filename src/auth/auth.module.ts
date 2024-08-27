import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/Token/entity/token.entity';
import { AuthGrpcController } from './auth.grpc.controller';
import { NotificationClient } from './auth.Client.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'notification_1',
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'notification-consumer',
          },
        }
      }
    ]),
    TypeOrmModule.forFeature([Token]),
    UserModule,
    RoleModule,
  ],
  controllers: [AuthController, AuthGrpcController],
  providers: [AuthService, NotificationClient],
  exports: [AuthService],
})
export class AuthModule {}
