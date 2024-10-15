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

import { Permission } from './entity/permission.entity';
import { PermissionService } from './permission.service';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { UpdatePermissionDTO } from './dto/update-permission.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { EAction, ESubject } from 'src/common/enums/action.enum';
import { AbilitiesGuard } from 'src/auth/guard/abilities.guard';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';
import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { get } from 'http';

@Controller('permissions')
@UseGuards(AuthGuard, AbilitiesGuard)
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get('')
  @CheckAbilities({ action: EAction.READ, subject: ESubject.user })
  async getPermissionsWithPagination(
    @Query() queryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<Permission>> {
    return await this.permissionService.getPermissionsWithPagination(
      queryPagination,
    );
  }

  @Get('/withoutPagination')
  @CheckAbilities({ action: EAction.READ, subject: ESubject.user })
  async getPermission(): Promise<Permission[]> {
    return this.permissionService.getPermissions();
  }

  @Post('')
  @CheckAbilities({ action: EAction.WRITE, subject: ESubject.user })
  createRole(
    @Body() createPermission: CreatePermissionDTO,
  ): Promise<Permission> {
    return this.permissionService.createPermission(createPermission);
  }

  @Put('/:id')
  @CheckAbilities({ action: EAction.UPDATE, subject: ESubject.user })
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDTO: UpdatePermissionDTO,
  ): Promise<Permission> {
    return this.permissionService.updatePermission(id, updatePermissionDTO);
  }

  @Delete('/:id')
  @CheckAbilities({ action: EAction.DELETE, subject: ESubject.user })
  deleteRole(@Param('id', ParseUUIDPipe) id: string): Promise<Permission> {
    return this.permissionService.deletePermission(id);
  }
}
