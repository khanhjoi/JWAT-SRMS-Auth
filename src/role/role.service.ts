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
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';
import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { UpdateStatusRole } from './dto/request/update-status-role.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { CacheSharedService } from 'src/shared/cache/cacheShared.service';

@Injectable()
export class RoleService {
  constructor(
    private roleRepository: RoleRepository,
    private permissionsRepository: PermissionRepository,
    private configService: ConfigService,
    private useService: UserService,
    private cacheService: CacheSharedService,
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

  async updateRole(
    roleId: string,
    updateRoleDTO: UpdateRoleDTO,
  ): Promise<Role> {
    let role = await this.roleRepository.findRoleById(roleId);

    const users = await this.useService.findUsersWithRoleId(roleId);

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

    // clear cache user with this role permission
    for (const user of users) {
      await this.cacheService.deleteValue(user.id);
      await this.cacheService.deleteValue(user.email);
    }

    let updateRole = await this.roleRepository.updateRole(role);

    return updateRole;
  }

  async updateStatusRole(
    roleId: string,
    data: UpdateStatusRole,
  ): Promise<Role> {
    const role = await this.roleRepository.findRoleById(roleId);
    const users = await this.useService.findUsersWithRoleId(roleId);

    if (!role) {
      throw new NotFoundException(
        'Role not found',
        AuthErrorCode.ROLE_FIND_FAILED,
      );
    }

    if (role.id === this.configService.get<string>('super_Admin_Id')) {
      throw new BadRequestException(
        "Super Admin Can't Deactivate",
        AuthErrorCode.ROLE_UPDATE_FAILED,
      );
    }

    // clear cache user with this role permission
    for (const user of users) {
      await this.cacheService.deleteValue(user.id);
      await this.cacheService.deleteValue(user.email);
    }

    const roleUpdated = await this.roleRepository.updateStatusRole(
      roleId,
      data.status,
    );

    return roleUpdated;
  }

  async deleteRole(roleId: string): Promise<Role> {
    const role = await this.roleRepository.findRoleById(roleId);
    const users = await this.useService.findUsersWithRoleId(roleId);

    if (!role) {
      throw new NotFoundException(
        'Role not found',
        AuthErrorCode.ROLE_FIND_FAILED,
      );
    }

     // clear cache user with this role permission
     for (const user of users) {
      await this.cacheService.deleteValue(user.id);
      await this.cacheService.deleteValue(user.email);
    }

    const roleDeleted = await this.roleRepository.deleteRole(role);

    return roleDeleted;
  }
}
