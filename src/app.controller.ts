import { Controller, Get, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { RpcValidationFilter } from './common/exeptions/rpc-valiadate.exception';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseFilters(new RpcValidationFilter()) 
  @MessagePattern({ cmd: 'register' })
  register(
    @Payload()
    registerPayload: any,
  ) {
    throw new RpcException({
      message: "test",
      statusCode: 403
    })
  }

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: 'login' })
  login(
    @Payload()
    loginPayload: any,
  ) {
    return loginPayload;
  }
}
