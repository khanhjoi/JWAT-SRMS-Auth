import { Controller, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcValidationFilter } from 'src/common/exeptions/rpc-valiadate.exception';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { LoginRequestDTO } from './dto/request/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: 'login' })
  login(@Payload() loginPayload: LoginRequestDTO) {
    return this.authService.login(loginPayload);
  }

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: 'register' })
  register(@Payload() registerPayload: RegisterRequestDTO) {
    return this.authService.register(registerPayload);
  }
}
