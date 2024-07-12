import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  @MessagePattern({ cmd: '/profile' })
  getProfile() {
    return 'user';
  }
}
