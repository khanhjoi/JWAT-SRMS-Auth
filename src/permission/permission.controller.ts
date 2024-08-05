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

@Controller('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get('')
  @UseGuards(AuthGuard)
  async getAllPermission(): Promise<Permission[]> {
    return await this.permissionService.getPermissions();
  }

  @Post('')
  @UseGuards(AuthGuard)
  createRole(
    @Body() createPermission: CreatePermissionDTO,
  ): Promise<Permission> {
    return this.permissionService.createPermission(createPermission);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDTO: UpdatePermissionDTO,
  ): Promise<Permission> {
    return this.permissionService.updatePermission(id, updatePermissionDTO);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  deleteRole(@Param('id', ParseUUIDPipe) id: string): Promise<Permission> {
    return this.permissionService.deletePermission(id);
  }
}
