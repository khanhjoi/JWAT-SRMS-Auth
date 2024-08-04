import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO } from './dto/request/create-role.dto';
import { UpdateRoleDTO } from './dto/request/update-role.dto';
import { Role } from './entity/role.entity';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get('')
  async getAllRoles() {
    const res = await this.roleService.getRoles();
    return res;
  }

  @Post('')
  async createRole(@Body() data: CreateRoleDTO) {
    const res = await this.roleService.createRole(data);
    return res;
  }

  @Put('/:id')
  async updateRole(
    @Body() data: UpdateRoleDTO,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Role> {
    const res = await this.roleService.updateRole(id, data);
    return res;
  }

  @Delete('/:id')
  deleteRole(@Param('id', ParseUUIDPipe) id: string): Promise<Role> {
    return this.roleService.deleteRole(id);
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
