import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern({ cmd: '/profile' })
  async getProfile(@Payload() data: any) {
    const userPayload = data.user;
    const user = await this.userService.findUserById(userPayload.sub);
    return user;
  }
}
