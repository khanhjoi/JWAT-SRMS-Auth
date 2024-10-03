import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ConfigurationEnv, {
  DatabaseConfigType,
  RedisConfigType,
} from '../config-env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedJwtModule } from './shared/jwt/jwt.module';
import { TokenModule } from './Token/token.module';
import { CaslModule } from './casl/casl.module';
import { CacheSharedModule } from '@khanhjoi/protos';
import configEnv from '../config-env';
// import { CacheSharedModule } from './shared/cache/cacheShared.module';

configEnv();

console.log(process.env.NODE_ENV);
console.log(__dirname + './**/*.entity{.ts,.js}');


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
          configService.get<DatabaseConfigType>('database');
        return {
          type: databaseConfig.type || 'postgres',
          host: databaseConfig.host,
          port: databaseConfig.port,
          username: databaseConfig.username,
          password: databaseConfig.password,
          database: databaseConfig.dbName,
          schema: databaseConfig.dbSchema,
          entities: [
            process.env.NODE_ENV === 'production'
              ? __dirname + '/**/*.entity{.ts,.js}'
              : __dirname + '/../**/*.entity{.ts,.js}',
          ],
          migrations: [
            process.env.NODE_ENV === 'production'
              ? 'dist/db/migrations/*{.ts,.js}'
              : `${__dirname}/../../db/migrations/*{.ts,.js}`,
          ],
          // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          // migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
        };
      },
      inject: [ConfigService],
    }),
    // CacheSharedModule,
    CacheSharedModule,
    SharedJwtModule,
    AuthModule,
    UserModule,
    PermissionModule,
    RoleModule,
    TokenModule,
    CaslModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
