import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateRoleDTO } from './dto/request/create-role.dto';

import { RpcException } from '@nestjs/microservices';
import {
  AssignPermissionPayload,
  AssignPermissionQuery,
} from './dto/request/assign-permission.dto';
import { Permission } from 'src/permission/entity/permission.entity';
import { Role } from './entity/role.entity';
import { RoleRepository } from './role.repository';
import { UpdateRoleDTO } from './dto/request/update-role.dto';
import { PermissionRepository } from 'src/permission/permission.repository';
import { DeleteRoleDTO } from './dto/request/delete-role.dto';

@Injectable()
export class RoleService {
  constructor(
    private roleRepository: RoleRepository,
    private permissionsRepository: PermissionRepository,
  ) {}

  async getRoles(): Promise<{ roles: Role[] }> {
    const roles = await this.roleRepository.getRoles();
    return { roles: roles };
  }

  async createRole(createRolePayLoad: CreateRoleDTO): Promise<{ role: Role }> {
    const role = await this.roleRepository.createRole(createRolePayLoad);
    return { role: role };
  }

  async updateRole(updateRoleDTO: UpdateRoleDTO): Promise<{ role: Role }> {
    let role = await this.roleRepository.findRoleById(updateRoleDTO.id);

    if (!role) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Role not found',
      });
    }

    if (updateRoleDTO.permissions) {
      let permissions = await this.permissionsRepository.findPermissionsWithIds(
        updateRoleDTO.permissions,
      );
      role.permissions = permissions;
    }

    role = {
      ...role,
      ...updateRoleDTO,
    };

    let updateRole = await this.roleRepository.updateRole(role);

    return { role: updateRole };
  }

  async deleteRole(deleteDTO: DeleteRoleDTO): Promise<{ role: Role }> {
    const role = await this.roleRepository.findRoleById(deleteDTO.id);

    if (!role) {
      throw new RpcException({ 
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Role not found',
      });
    }

    const roleDeleted = await this.roleRepository.deleteRole(role);

    return { role: roleDeleted };
  }

  // async assignPermission(
  //   assignPermissionPayload: AssignPermissionPayload,
  //   assignPermissionQuery: AssignPermissionQuery,
  // ): Promise<Role> {
  //   const role = await this.roleRep.findOne({
  //     where: {
  //       id: assignPermissionQuery.id,
  //     },
  //     relations: ['permissions'],
  //   });

  //   if (!role) {
  //     throw new RpcException({
  //       statusCode: HttpStatus.NOT_FOUND,
  //       message: 'Role does not exist',
  //     });
  //   }

  //   const permissionsToAssign = await this.permissionRep.findByIds(
  //     assignPermissionPayload.permissions,
  //   );

  //   role.permissions = permissionsToAssign;

  //   const roleAsAssign = await this.roleRep.save(role);

  //   return roleAsAssign;
  // }
}
