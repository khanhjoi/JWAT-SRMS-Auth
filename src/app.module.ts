import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ConfigurationEnv, { databaseConfigType } from '../config-env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

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
        const databaseConfig =
          configService.get<databaseConfigType>('database');
        return {
          type: databaseConfig.type,
          host: databaseConfig.host,
          port: databaseConfig.port,
          username: databaseConfig.username,
          password: databaseConfig.password,
          database: databaseConfig.dbName,
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
