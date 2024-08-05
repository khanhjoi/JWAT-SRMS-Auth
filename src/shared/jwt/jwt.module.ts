import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('jwt_secret'),
        signOptions: { expiresIn: config.get<string>('jwt_expires') },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class SharedJwtModule {}
