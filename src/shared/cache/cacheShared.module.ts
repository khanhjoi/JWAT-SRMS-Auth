import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfigType } from 'config-env';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheSharedService } from './cacheShared.service';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get<RedisConfigType>('redis');
         return {
          store: await redisStore({
            socket: {
              host: redisConfig.host,
              port: redisConfig.port,
            },
            ttl: 86400,
          }),
        };
      },
    }),
  ],
  providers: [CacheSharedService],
  exports: [CacheSharedService],
})
export class CacheSharedModule {}
