import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/Token/entity/token.entity';
import { AuthGrpcController } from './auth.grpc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), UserModule, RoleModule],
  controllers: [AuthController, AuthGrpcController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
