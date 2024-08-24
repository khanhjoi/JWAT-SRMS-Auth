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

import { Permission } from './entity/permission.entity';
import { PermissionService } from './permission.service';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { UpdatePermissionDTO } from './dto/update-permission.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Action } from 'src/common/enums/action.enum';
import { AbilitiesGuard } from 'src/auth/guard/abilities.guard';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';

@Controller('permission')
@UseGuards(AuthGuard, AbilitiesGuard)
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get('')
  @CheckAbilities({ action: Action.UPDATE, subject: 'User' })
  async getAllPermission(): Promise<Permission[]> {
    return await this.permissionService.getPermissions();
  }

  @Post('')
  @CheckAbilities({ action: Action.WRITE, subject: 'User' })
  createRole(
    @Body() createPermission: CreatePermissionDTO,
  ): Promise<Permission> {
    return this.permissionService.createPermission(createPermission);
  }

  @Put('/:id')
  @CheckAbilities({ action: Action.UPDATE, subject: 'User' })
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDTO: UpdatePermissionDTO,
  ): Promise<Permission> {
    return this.permissionService.updatePermission(id, updatePermissionDTO);
  }

  @Delete('/:id')
  @CheckAbilities({ action: Action.DELETE, subject: 'User' })
  deleteRole(@Param('id', ParseUUIDPipe) id: string): Promise<Permission> {
    return this.permissionService.deletePermission(id);
  }
}
