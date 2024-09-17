import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { AbilitiesGuard } from 'src/auth/guard/abilities.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';
import { User } from './entity/user.entity';
import { Action } from 'src/common/enums/action.enum';
import { UpdateUserByAdminDTO } from './dto/update-user-by-admin.dto';
import { AdminUserService } from './admin.service';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('/admin')
export class AdminController {
  constructor(
    private adminUserService: AdminUserService,
    private userService: UserService,
  ) {}

  @Get('/users')
  @CheckAbilities({ action: Action.READ, subject: 'User' })
  @UseGuards(AuthGuard, AbilitiesGuard)
  async getUsersAdmin(
    @Query() userQueryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<User>> {
    const res = await this.adminUserService.findAllUserWithPagination(userQueryPagination);
    return res;
  }

  @Post('/user')
  @CheckAbilities({ action: Action.WRITE, subject: 'User' })
  @UseGuards(AuthGuard, AbilitiesGuard)
  async addUserAdmin(@Body() createUserDto: CreateUserDTO): Promise<User> {
    const res = await this.userService.createUser(createUserDto);
    return res; 
  }

  @Put('/user')
  @CheckAbilities({ action: Action.UPDATE, subject: 'User' })
  @UseGuards(AuthGuard, AbilitiesGuard)
  async updateUser(@Body() updateUser: UpdateUserByAdminDTO): Promise<User> {
    const res = await this.adminUserService.updateUser(updateUser);
    return res;
  }

  @Put('/user/:id/active')
  @CheckAbilities({ action: Action.UPDATE, subject: 'User' })
  @UseGuards(AuthGuard, AbilitiesGuard)
  async activeUser(@Param('id') userId: string): Promise<User> {
    const res = await this.adminUserService.activeUser(userId);
    return res;
  }

  @Delete('/user/:id')
  @CheckAbilities({ action: Action.UPDATE, subject: 'User' })
  @UseGuards(AuthGuard, AbilitiesGuard)
  async delete(@Param('id') userId: string): Promise<User> {
    const res = await this.adminUserService.deleteUser(userId);
    return res;
  }
}
