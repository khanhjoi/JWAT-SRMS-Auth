import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDTO } from './dto/request/create-role.dto';
import { Role } from './entity/role.entity';
import { RoleRepository } from './role.repository';
import { UpdateRoleDTO } from './dto/request/update-role.dto';
import { PermissionRepository } from 'src/permission/permission.repository';
import { NotFoundException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';

@Injectable()
export class RoleService {
  constructor(
    private roleRepository: RoleRepository,
    private permissionsRepository: PermissionRepository,
  ) {}

  async getRoles(): Promise<Role[]> {
    const roles = await this.roleRepository.getRoles();
    return roles;
  }

  async createRole(createRolePayLoad: CreateRoleDTO): Promise<Role> {
    const role = await this.roleRepository.createRole(createRolePayLoad);
    return role;
  }

  async updateRole(id: string, updateRoleDTO: UpdateRoleDTO): Promise<Role> {
    let role = await this.roleRepository.findRoleById(id);

    if (!role) {
      throw new NotFoundException(
        'Role not found',
        AuthErrorCode.ROLE_FIND_FAILED,
      );
    }

    if (updateRoleDTO.permissions) {
      let permissions = await this.permissionsRepository.findPermissionsWithIds(
        updateRoleDTO.permissions,
      );
      updateRoleDTO.permissions = permissions;
    }

    role = {
      ...role,
      ...updateRoleDTO,
    };

    let updateRole = await this.roleRepository.updateRole(role);

    return updateRole;
  }

  async deleteRole(id: string): Promise<Role> {
    const role = await this.roleRepository.findRoleById(id);

    if (!role) {
      throw new NotFoundException(
        'Role not found',
        AuthErrorCode.ROLE_FIND_FAILED,
      );
    }

    const roleDeleted = await this.roleRepository.deleteRole(role);

    return roleDeleted;
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
