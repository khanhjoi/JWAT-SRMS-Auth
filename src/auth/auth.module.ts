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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaConfigType } from 'config-env';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'NOTIFICATION_SERVICE',
        useFactory: async (configService: ConfigService) => {
          const kafkaConfig = configService.get<KafkaConfigType>('kafka');
          console.log(kafkaConfig)
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: kafkaConfig.clientId,
                brokers: [kafkaConfig.broker], // this is call cluster -> many broker
              },
              consumer: {
                groupId: kafkaConfig.groupId,
              },
            },
          };
        },
        inject: [ConfigService],
      },
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
