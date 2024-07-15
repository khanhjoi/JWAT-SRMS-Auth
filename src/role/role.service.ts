import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/rote.entity';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from './dto/request/create-role.dto';
import {
  UpdateRolePayload,
  UpdateRoleQuery,
} from './dto/request/update-role.dto';
import { RpcException } from '@nestjs/microservices';
import { DeleteQueryDTO } from './dto/request/delete-role.dto';
import {
  AssignPermissionPayload,
  AssignPermissionQuery,
} from './dto/request/assign-permission.dto';
import { Permission } from 'src/permission/entity/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permissions>,
  ) {}

  async getRoles(): Promise<Role[]> {
    const roles = await this.roleRepository.find({
      relations: {
        permissions: true,
      },
    });
    return roles;
  }

  async createRole(createRolePayLoad: CreateRoleDTO): Promise<Role> {
    const role = await this.roleRepository.save(createRolePayLoad);
    return role;
  }

  async updateRole(
    updateRoleDTO: UpdateRolePayload,
    query: UpdateRoleQuery,
  ): Promise<Role> {
    let role = await this.roleRepository.findOneBy({
      id: query.id,
    });

    if (!role) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Role not found',
      });
    }

    role = {
      ...role,
      ...updateRoleDTO,
    };

    let updateRole = await this.roleRepository.save(role);

    return updateRole;
  }

  async deleteRole(query: DeleteQueryDTO): Promise<Role> {
    const role = await this.roleRepository.findOneBy({
      id: query.id,
    });

    if (!role) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Role not found',
      });
    }

    const roleDeleted = await this.roleRepository.remove(role);

    return roleDeleted;
  }

  async assignPermission(
    assignPermissionPayload: AssignPermissionPayload,
    assignPermissionQuery: AssignPermissionQuery,
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        id: assignPermissionQuery.id,
      },
      relations: ['permissions'],
    });

    if (!role) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Role does not exist',
      });
    }

    const permissionsToAssign = await this.permissionRepository.findByIds(
      assignPermissionPayload.permissions,
    );

    role.permissions = permissionsToAssign;


    const roleAsAssign = await this.roleRepository.save(role);

    return roleAsAssign;
  }
}
