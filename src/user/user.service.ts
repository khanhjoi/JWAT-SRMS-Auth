import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (user) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User already exists',
      });
    }

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(createUserDto.password, salt);

    const newUser = await this.userRepository.save({
      email: createUserDto.email,
      password: password,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    });

    return newUser;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: email });

    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    return user;
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new RpcException({
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return user;
  }
}
