import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Token } from 'src/Token/entity/token.entity';
import { UserRepository } from './user.repository';
import { AdminController } from './admin.controller';
import { AdminUserService } from './admin.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('jwt_secret'),
          signOptions: {
            expiresIn: config.get<string>('jwt_expires'),
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Token]),
  ],
  controllers: [UserController, AdminController],
  providers: [UserService, AdminUserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
