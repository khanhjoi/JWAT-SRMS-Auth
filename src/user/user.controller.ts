import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Action } from 'src/common/enums/action.enum';
import { AbilitiesGuard } from 'src/auth/guard/abilities.guard';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';

import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';

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
  async getUserAdmin(
    @Query() userQueryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<User>> {
    const res = await this.userService.getAllUsers(userQueryPagination);
    return res;
  }
}
