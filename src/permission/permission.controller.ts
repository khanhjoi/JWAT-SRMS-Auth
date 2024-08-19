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
import { PermissionsGuard } from 'src/auth/guard/permission.guard';
import { CheckPermissions } from 'src/common/decorators/abilities.decorator';
import { Action } from 'src/common/enums/action.enum';

@Controller('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get('')
  @UseGuards(AuthGuard, PermissionsGuard)
  @CheckPermissions([[Action.READ, 'User']])
  async getAllPermission(): Promise<Permission[]> {
    return await this.permissionService.getPermissions();
  }

  @Post('')
  @UseGuards(AuthGuard, PermissionsGuard)
  @CheckPermissions([[Action.WRITE, 'User']])
  createRole(
    @Body() createPermission: CreatePermissionDTO,
  ): Promise<Permission> {
    return this.permissionService.createPermission(createPermission);
  }

  @Put('/:id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @CheckPermissions([[Action.UPDATE, 'User']])
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDTO: UpdatePermissionDTO,
  ): Promise<Permission> {
    return this.permissionService.updatePermission(id, updatePermissionDTO);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @CheckPermissions([[Action.DELETE, 'User']])
  deleteRole(@Param('id', ParseUUIDPipe) id: string): Promise<Permission> {
    return this.permissionService.deletePermission(id);
  }
}
