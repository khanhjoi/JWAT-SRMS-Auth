import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Action } from 'src/common/enums/action.enum';
import { AbilitiesGuard } from 'src/auth/guard/abilities.guard';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';

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
  @CheckAbilities({ action: Action.READ, subject: 'User' })
  @UseGuards(AuthGuard, AbilitiesGuard)
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @CheckPermissions([[Action.READ, 'User']])
  async getUserAdmin(): Promise<User[]> {
    const res = await this.userService.getAllUsers();
    return res;
  }
}
