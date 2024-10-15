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
import { EAction, ESubject } from 'src/common/enums/action.enum';
import { UpdateUserByAdminDTO } from './dto/update-user-by-admin.dto';
import { AdminUserService } from './admin.service';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { AssignRoleDto } from 'src/role/dto/request/assign-permission.dto';

@Controller('/admin')
@UseGuards(AuthGuard, AbilitiesGuard)
export class AdminController {
  constructor(
    private adminUserService: AdminUserService,
    private userService: UserService,
  ) {}

  @Get('/users')
  @CheckAbilities({ action: EAction.READ, subject: ESubject.user })
  async getUsersAdmin(
    @Query() userQueryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<User>> {
    const res =
      await this.adminUserService.findAllUserWithPagination(
        userQueryPagination,
      );
    return res;
  }

  @Get('/users/:id')
  @CheckAbilities({ action: EAction.READ, subject: ESubject.user })
  async getUserDetailAdmin(@Param('id') id: string): Promise<User> {
    const res = await this.userService.findUserById(id, [
      'id',
      'lastName',
      'firstName',
      'email',
      'createdAt',
      'role',
    ]);
    return res;
  }

  @Post('/user')
  @CheckAbilities({ action: EAction.WRITE, subject: ESubject.user })
  async addUserAdmin(@Body() createUserDto: CreateUserDTO): Promise<User> {
    const res = await this.userService.createUser(createUserDto);
    return res;
  }

  @Post('/user/:userId/assign-role/:roleId')
  @CheckAbilities({ action: EAction.UPDATE, subject: ESubject.user })
  async assignRole(@Param() params: AssignRoleDto): Promise<User> {
    const { userId, roleId } = params;
    const res = await this.adminUserService.assignRole(userId, roleId);
    return res;
  }

  @Put('/user')
  @CheckAbilities({ action: EAction.UPDATE, subject: ESubject.user })
  async updateUser(@Body() updateUser: UpdateUserByAdminDTO): Promise<User> {
    const res = await this.adminUserService.updateUser(updateUser);
    return res;
  }

  @Put('/user/:id/active')
  @CheckAbilities({ action: EAction.UPDATE, subject: ESubject.user })
  async activeUser(@Param('id') userId: string): Promise<User> {
    const res = await this.adminUserService.activeUser(userId);
    return res;
  }

  @Delete('/user/:id')
  @CheckAbilities({ action: EAction.DELETE, subject: ESubject.user })
  async delete(@Param('id') userId: string): Promise<User> {
    const res = await this.adminUserService.deleteUser(userId);
    return res;
  }
}
