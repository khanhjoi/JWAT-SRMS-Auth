import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshRepository } from './refreshToken.repository';
import { RefreshTokenService } from './refreshToken.service';
import { Token } from './entity/token.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  controllers: [],
  providers: [RefreshRepository, RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
