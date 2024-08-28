import { HttpStatus, Injectable } from '@nestjs/common';
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
import { PermissionGetByRoleDTO } from './dto/response/permission.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class RoleService {
  constructor(
    private roleRepository: RoleRepository,
    private userService: UserService,
    private permissionsRepository: PermissionRepository,
  ) {}

  async getRoles(): Promise<Role[]> {
    const roles = await this.roleRepository.getRoles();
    return roles;
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

  async assignRole(userId: string, roleId: string): Promise<User> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException(
        `User ${userId} does not exist`,
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    const role = await this.roleRepository.findRoleById(roleId);

    if (!role) {
      throw new NotFoundException(
        `role ${roleId} does not exist`,
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    user.role = role;
    
    const userUpdated = await this.userService.updateUser(user);

    return userUpdated;
  }
}
