import { Injectable } from '@nestjs/common';
import { CreateRoleDTO } from './dto/request/create-role.dto';
import { Role } from './entity/role.entity';
import { RoleRepository } from './role.repository';
import { UpdateRoleDTO } from './dto/request/update-role.dto';
import { PermissionRepository } from 'src/permission/permission.repository';
import {
  BadRequestException,
  NotFoundException,
} from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { Permission } from 'src/permission/entity/permission.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';
import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { UpdateStatusRole } from './dto/request/update-status-role.dto';

@Injectable()
export class RoleService {
  constructor(
    private roleRepository: RoleRepository,
    private permissionsRepository: PermissionRepository,
  ) {}

  async getRolesWithPagination(
    queryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<Role>> {
    const roles =
      await this.roleRepository.getRolesWithPagination(queryPagination);
    return roles;
  }

  async getRoles(): Promise<Role[]> {
    const roles = await this.roleRepository.getRoles();
    return roles;
  }
  
  async getRoleWithId(id: string): Promise<Role> {
    const role = await this.roleRepository.findRoleById(id);

    if (!role) {
      throw new BadRequestException(
        'Role Not Found',
        AuthErrorCode.ROLE_FIND_FAILED,
      );
    }

    return role;
  }

  async getPermissionOfRole(id: string): Promise<Permission[]> {
    const role = await this.roleRepository.findRoleById(id);

    if (!role) {
      throw new BadRequestException(
        'Role Not Found',
        AuthErrorCode.ROLE_FIND_FAILED,
      );
    }

    return role.permissions;
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

  async updateStatusRole(
    roleId: string,
    data: UpdateStatusRole,
  ): Promise<Role> {
    const roleUpdated = await this.roleRepository.updateStatusRole(
      roleId,
      data.status,
    );
    return roleUpdated;
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

 
}
