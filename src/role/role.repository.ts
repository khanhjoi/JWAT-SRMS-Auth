import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
        throw new HttpException(
          'Find role failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.find({
        relations: {
          permissions: true,
        },
      });
      return roles;
    } catch (error) {
      if (error) {
        throw new HttpException(
          'Find Role had some issues',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateRole(role: Role): Promise<Role> {
    try {
      const roleUpdate = await this.roleRepository.save(role);
      return roleUpdate;
    } catch (error) {
      if (error) {
        throw new HttpException(
          'Update role had some issues',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createRole(createRoleDTO: CreateRoleDTO): Promise<Role> {
    try {
      const role = await this.roleRepository.save(createRoleDTO);
      return role;
    } catch (error) {
      if (error) {
        throw new HttpException(
          'Create Role had some issues',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async deleteRole(role: Role): Promise<Role> {
    try {
      const roleDeleted = await this.roleRepository.remove(role);
      return roleDeleted;
    } catch (error) {
      if (error) {
        throw new HttpException(
          'Delete Role had some issues',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
