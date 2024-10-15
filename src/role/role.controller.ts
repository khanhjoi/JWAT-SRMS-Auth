import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO } from './dto/request/create-role.dto';
import { UpdateRoleDTO } from './dto/request/update-role.dto';
import { Role } from './entity/role.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { EAction, ESubject } from 'src/common/enums/action.enum';
import { AbilitiesGuard } from 'src/auth/guard/abilities.guard';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';
import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { UpdateStatusRole } from './dto/request/update-status-role.dto';

@Controller('roles')
@UseGuards(AuthGuard, AbilitiesGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get('')
  @CheckAbilities({ action: EAction.READ, subject: ESubject.user })
  async getRolesWithPagination(
    @Query() queryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<Role>> {
    const res = await this.roleService.getRolesWithPagination(queryPagination);
    return res;
  }

  @Get('/withoutPagination')
  @CheckAbilities({ action: EAction.READ, subject: ESubject.user })
  async getAllRoles(): Promise<Role[]> {
    const res = await this.roleService.getRoles();
    return res;
  }

  @Get('/:id')
  @CheckAbilities({ action: EAction.READ, subject: ESubject.user })
  async getRoles(@Param('id') roleId: string): Promise<Role> {
    const res = await this.roleService.getRoleWithId(roleId);
    return res;
  }

  @Post('')
  @CheckAbilities({ action: EAction.WRITE, subject: ESubject.user })
  async createRole(@Body() data: CreateRoleDTO): Promise<Role> {
    const res = await this.roleService.createRole(data);
    return res;
  }

  @Put('/:id')
  @CheckAbilities({ action: EAction.UPDATE, subject: ESubject.user })
  async updateRole(
    @Body() data: UpdateRoleDTO,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Role> {
    const res = await this.roleService.updateRole(id, data);
    return res;
  }

  @Put('/:id/status')
  @CheckAbilities({ action: EAction.UPDATE, subject: ESubject.user })
  async activeRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateStatusRole,
  ): Promise<Role> {
    const res = await this.roleService.updateStatusRole(id, data);
    return res;
  }

  @Delete('/:id')
  @CheckAbilities({ action: EAction.DELETE, subject: ESubject.user })
  async deleteRole(@Param('id', ParseUUIDPipe) id: string): Promise<Role> {
    const res = await this.roleService.deleteRole(id);
    return res;
  }
}
