import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req): Promise<User> {
    const res = await this.userService.findUserById(req.user.sub, [
      'id',
      'lastName',
      'firstName',
      'email',
      'createdAt',
      'role'
    ]);
    return res;
  }
}
