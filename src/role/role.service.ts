import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/rote.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateRoleDTO } from './dto/request/create-role.dto';
import {
  UpdateRoleDTO,
  UpdateRolePayload,
  UpdateRoleQuery,
} from './dto/request/update-role.dto';
import { RpcException } from '@nestjs/microservices';
import { DeleteQueryDTO, DeleteRoleDTO } from './dto/request/delete-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async getRoles(): Promise<Role[]> {
    const roles = await this.roleRepository.find();
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

    return roleDeleted
  }
}
