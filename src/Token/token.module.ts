import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenRepository } from './token.repository';
import { TokenService } from './token.service';
import { Token } from './entity/token.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  controllers: [],
  providers: [TokenRepository, TokenService],
  exports: [TokenService],
})
export class TokenModule {}
