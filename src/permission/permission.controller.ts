import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { RpcValidationFilter } from 'src/common/exeptions/rpc-valiadate.exception';
import { Permission } from './entity/permission.entity';
import { PermissionService } from './permission.service';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { UpdatePermissionDTO } from './dto/update-permission.dto';
import { DeletePermissionDTO } from './dto/delete-permission.dto';
import { Observable } from 'rxjs';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

@Controller('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @GrpcMethod('AuthService', 'GetAllPermission')
  @UseFilters(new RpcValidationFilter())
  async getAllPermission(): Promise<{ permissions: Permission[] }> {
    return await this.permissionService.getPermissions();
  }

  @GrpcMethod('AuthService', 'AddPermission')
  @UseFilters(new RpcValidationFilter())
  createRole(
    createPermission: CreatePermissionDTO,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<{ permission: Permission }> {
    return this.permissionService.createPermission(createPermission);
  }

  @GrpcMethod('AuthService', 'UpdatePermission')
  @UseFilters(new RpcValidationFilter())
  updateRole(
    updatePermissionDTO: UpdatePermissionDTO,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<{ permission: Permission }> {
    return this.permissionService.updatePermission(updatePermissionDTO);
  }

  @UseFilters(new RpcValidationFilter())
  @GrpcMethod('AuthService', 'DeletePermission')
  deleteRole(
    deletePermissionDTO: DeletePermissionDTO,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<{ permission: Permission }> {
    return this.permissionService.deletePermission(deletePermissionDTO.id);
  }
}
