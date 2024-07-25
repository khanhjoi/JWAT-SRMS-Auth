import { Controller, UseFilters } from '@nestjs/common';
import { RoleService } from './role.service';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { Role } from './entity/rote.entity';
import { CreateRoleDTO } from './dto/request/create-role.dto';
import { RpcValidationFilter } from 'src/common/exeptions/rpc-valiadate.exception';
import { UpdateRoleDTO } from './dto/request/update-role.dto';
import { DeleteRoleDTO } from './dto/request/delete-role.dto';
import { AssignPermissionDTO } from './dto/request/assign-permission.dto';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

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

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: { url: '/role-assign-permission', method: 'POST' } })
  assignPermission(
    @Payload() assignPermissionDTO: AssignPermissionDTO,
  ): Promise<Role> {
    return this.roleService.assignPermission(
      assignPermissionDTO.data,
      assignPermissionDTO.query,
    );
  }

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: { url: '/role', method: 'PUT' } })
  updateRole(@Payload() updatePayload: UpdateRoleDTO): Promise<Role> {
    return this.roleService.updateRole(updatePayload.data, updatePayload.query);
  }

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: { url: '/role', method: 'DELETE' } })
  deleteRole(@Payload() deleteRole: DeleteRoleDTO): any {
    return this.roleService.deleteRole(deleteRole.query);
  }
}
