import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { CreateRoleDTO } from './dto/request/create-role.dto';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async findRoleById(roleId: string): Promise<Role> {
    try {
      const role = await this.roleRepository.findOneBy({ id: roleId });
      return role;
    } catch (error) {
      if (error) {
        throw new RpcException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Find role failed',
        });
      }
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.find({
        relations: {
          permissions:true,
        },
      });
      return roles;
    } catch (error) {
      if (error) {
        throw new RpcException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Find Role had some issues',
        });
      }
    }
  }

  async updateRole(role: Role): Promise<Role> {
    try {
      const roleUpdate = await this.roleRepository.save(role)
      return roleUpdate;
    } catch (error) {
      if (error) {
        throw new RpcException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Create Role had some issues',
        });
      }
    }
  }

  async createRole(createRoleDTO: CreateRoleDTO): Promise<Role> {
    try {
      const role = await this.roleRepository.save(createRoleDTO);
      return role;
    } catch (error) {
      if (error) {
        throw new RpcException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Create Role had some issues',
        });
      }
    }
  }
 
  async deleteRole(role: Role): Promise<Role> {
    try {
      const roleDeleted = await this.roleRepository.remove(role);
      return roleDeleted;
    } catch (error) {
      if (error) {
        throw new RpcException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Delete Role had some issues',
        });
      }
    }
  }
}
