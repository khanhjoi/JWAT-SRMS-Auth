import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ConfigurationEnv from '../config-env';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ConfigurationEnv],
      envFilePath: ['.env.development.local', '.env.production.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: configService.get<string | any>('database.type'),
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.name'),
          synchronize: true,
          // dropSchema: true,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    PermissionModule,
    RoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
