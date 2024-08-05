import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { RpcValidationFilter } from 'src/common/exeptions/rpc-valiadate.exception';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { LoginRequestDTO } from './dto/request/login-request.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() data: LoginRequestDTO) {
    const res = await this.authService.login(data);
    return res;
  }

  @Post('/register')
  async register(@Body() data: RegisterRequestDTO) {
    const res = await this.authService.register(data);
    return res;
  }

  @Post('/profile')
  @UseGuards(AuthGuard)
  async getProfile(@Param('id') id: string) {
    return 'ok'
  }
}
