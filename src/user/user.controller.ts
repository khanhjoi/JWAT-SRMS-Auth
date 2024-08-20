import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { PermissionsGuard } from 'src/auth/guard/permission.guard';

import { CheckPermissions } from 'src/common/decorators/abilities.decorator';
import { Action } from 'src/common/enums/action.enum';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req): Promise<User> {
    const res = await this.userService.findUserById(req.user.sub, [
      'lastName',
      'firstName',
      'email',
      'createdAt',
    ]);
    return res;
  }

  @Get('/admin')
  @UseGuards(AuthGuard, PermissionsGuard)
  @CheckPermissions([[Action.READ, 'User']])
  async getUserAdmin(): Promise<User[]> {
    const res = await this.userService.getAllUsers();
    return res;
  }
}
