import { Controller, UseFilters } from '@nestjs/common';
import { RoleService } from './role.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Role } from './entity/rote.entity';
import { CreateRoleDTO } from './dto/request/create-role.dto';
import { RpcValidationFilter } from 'src/common/exeptions/rpc-valiadate.exception';
import { UpdateRoleDTO } from './dto/request/update-role.dto';
import { Validator } from 'class-validator';
import { response } from 'express';
import { DeleteRoleDTO } from './dto/request/delete-role.dto';

@Controller('role')
export class RoleController {
  constructor(private routeService: RoleService) {}

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: { url: '/role', method: 'GET' } })
  getAllRoles(): Promise<Role[]> {
    return this.routeService.getRoles();
  }

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: { url: '/role', method: 'POST' } })
  createRole(@Payload() createRolePayload: CreateRoleDTO): Promise<Role> {
    return this.routeService.createRole(createRolePayload);
  }

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: { url: '/role', method: 'PUT' } })
  updateRole(@Payload() updatePayload: UpdateRoleDTO): Promise<Role> {
    return this.routeService.updateRole(
      updatePayload.data,
      updatePayload.query,
    );
  }

  @UseFilters(new RpcValidationFilter())
  @MessagePattern({ cmd: { url: '/role', method: 'DELETE' } })
  deleteRole(@Payload() deleteRole: DeleteRoleDTO): any {
    return this.routeService.deleteRole(deleteRole.query);
  }
}
