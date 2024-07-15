import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcValidationFilter } from 'src/common/exeptions/rpc-valiadate.exception';
import { Permission } from './entity/permission.entity';
import { PermissionService } from './permission.service';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { UpdatePermissionDTO } from './dto/update-permission.dto';
import { DeletePermissionDTO } from './dto/delete-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: { url: '/permission', method: 'GET' } })
  getAllPermission(): Promise<Permission[]> {
    return this.permissionService.getPermissions();
  }

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: { url: '/permission', method: 'POST' } })
  createRole(
    @Payload() createPermission: CreatePermissionDTO,
  ): Promise<Permission> {
    return this.permissionService.createPermission(createPermission);
  }

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: { url: '/permission', method: 'PUT' } })
  updateRole(
    @Payload() updatePermissionDTO: UpdatePermissionDTO,
  ): Promise<Permission> {
    return this.permissionService.updatePermission(
      updatePermissionDTO.data,
      updatePermissionDTO.query,
    );
  }

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: { url: '/permission', method: 'DELETE' } })
  deleteRole(
    @Payload() deletePermissionDTO: DeletePermissionDTO,
  ): Promise<Permission> {
    return this.permissionService.deletePermission(deletePermissionDTO.query);
  }
}
