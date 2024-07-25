import {
  Controller,
  HttpStatus,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { RpcValidationFilter } from 'src/common/exeptions/rpc-valiadate.exception';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { LoginRequestDTO } from './dto/request/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  @UseFilters(new RpcValidationFilter())
  async login(
    data: LoginRequestDTO,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const res = await this.authService.login(data);
    return res;
  }

  @GrpcMethod('AuthService', 'Register')
  @UseFilters(new RpcValidationFilter())
  async register(
    data: RegisterRequestDTO,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const res = await this.authService.register(data);
    return res;
  }
}
