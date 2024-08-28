import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO } from './dto/request/create-role.dto';
import { UpdateRoleDTO } from './dto/request/update-role.dto';
import { Role } from './entity/role.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Action } from 'src/common/enums/action.enum';
import { User } from 'src/user/entity/user.entity';
import { AssignRoleDto } from './dto/request/assign-permission.dto';
import { AbilitiesGuard } from 'src/auth/guard/abilities.guard';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';

@Controller('role')
@UseGuards(AuthGuard, AbilitiesGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get('')
  // @CheckPermissions([[Action.READ, 'User']])
  @CheckAbilities({ action: Action.READ, subject: 'User' })
  async getAllRoles(): Promise<Role[]> {
    const res = await this.roleService.getRoles();
    return res;
  }

  @Post('')
  @CheckAbilities({ action: Action.WRITE, subject: 'User' })
  async createRole(@Body() data: CreateRoleDTO): Promise<Role> {
    const res = await this.roleService.createRole(data);
    return res;
  }

  @Post('/:userId/assign-role/:roleId')
  @CheckAbilities({ action: Action.WRITE, subject: 'User' })
  async assignRole(@Param() params: AssignRoleDto): Promise<User> {
    const { userId, roleId } = params;
    const res = await this.roleService.assignRole(userId, roleId);
    return res;
  }

  @Put('/:id')
  @CheckAbilities({ action: Action.UPDATE, subject: 'User' })
  async updateRole(
    @Body() data: UpdateRoleDTO,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Role> {
    const res = await this.roleService.updateRole(id, data);
    return res;
  }

  @Delete('/:id')
  @CheckAbilities({ action: Action.DELETE, subject: 'User' })
  async deleteRole(@Param('id', ParseUUIDPipe) id: string): Promise<Role> {
    const res = await this.roleService.deleteRole(id);
    return res;
  }
}
