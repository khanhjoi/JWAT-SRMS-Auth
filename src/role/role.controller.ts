import { Controller, UseFilters } from '@nestjs/common';
import { RoleService } from './role.service';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';

import { CreateRoleDTO } from './dto/request/create-role.dto';
import { RpcValidationFilter } from 'src/common/exeptions/rpc-valiadate.exception';
import { UpdateRoleDTO } from './dto/request/update-role.dto';
import { DeleteRoleDTO } from './dto/request/delete-role.dto';
import { AssignPermissionDTO } from './dto/request/assign-permission.dto';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Role } from './entity/role.entity';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @GrpcMethod('AuthService', 'GetAllRole')
  @UseFilters(new RpcValidationFilter())
  async getAllRoles(
    data: any,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const res = await this.roleService.getRoles();
    return res;
  }

  @GrpcMethod('AuthService', 'CreateRole')
  @UseFilters(new RpcValidationFilter())
  async createRole(
    data: CreateRoleDTO,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const res = await this.roleService.createRole(data);
    return res;
  }

  @GrpcMethod('AuthService', 'UpdateRole')
  @UseFilters(new RpcValidationFilter())
  async updateRole(
    data: UpdateRoleDTO,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const res = await this.roleService.updateRole(data);
    return res;
  }

  @GrpcMethod('AuthService', 'DeleteRole')
  @UseFilters(new RpcValidationFilter())
  deleteRole(
    data: DeleteRoleDTO,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    return this.roleService.deleteRole(data);
  }

  // @UseFilters(new RpcValidationFilter())
  // @MessagePattern({ cmd: { url: '/role-assign-permission', method: 'POST' } })
  // assignPermission(
  //   @Payload() assignPermissionDTO: AssignPermissionDTO,
  // ): Promise<Role> {
  //   return this.roleService.assignPermission(
  //     assignPermissionDTO.data,
  //     assignPermissionDTO.query,
  //   );
  // }
}
