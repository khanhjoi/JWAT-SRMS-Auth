import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createNewUser(createUserDTO: CreateUserDTO): Promise<User> {
    try {
      const user = await this.userRepository.save(createUserDTO);
      return user;
    } catch (error) {
      if (error) {
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Create user failed',
        });
      }
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ email: email });
      return user;
    } catch (error) {
      if (error) {
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'find user failed',
        });
      }
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id: id });
      return user;
    } catch (error) {
      if (error) {
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'find user failed',
        });
      }
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      const userUpdate = await this.userRepository.save(user)
      return userUpdate;
    } catch (error) {
      if (error) {
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Update user failed',
        });
      }
    }
  }
}
