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
  @MessagePattern({ cmd: { url: '/login', method: 'POST' } })
  login(@Payload() loginRequestDTO: LoginRequestDTO) {
    return this.authService.login(loginRequestDTO.data);
  }

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: { url: '/register', method: 'POST' } })
  register(@Payload() registerPayload: RegisterRequestDTO) {
    return this.authService.register(registerPayload.data);
  }
}
