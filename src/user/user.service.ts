import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import {
  BadRequestException,
  NotFoundException,
} from '@khanhjoi/protos/dist/errors/http';
import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(
    userQueryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<User>> {
    const users = await this.userRepository.findAllUser(
      userQueryPagination,
      ['id', 'lastName', 'firstName', 'email', 'createdAt', 'role'],
      ['role'],
    );
    return users;
  }

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const isUserExit = await this.userRepository.findUserByEmail(
      createUserDto.email,
    );

    if (isUserExit) {
      throw new BadRequestException(
        'User already exists',
        AuthErrorCode.USER_CREATE_FAILED,
      );
    }

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(createUserDto.password, salt);

    const newUser = await this.userRepository.createNewUser({
      email: createUserDto.email,
      password: password,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    });

    return newUser;
  }

  async findUserByEmail(
    email: string,
    select?: (keyof User)[],
    relations?: (keyof User)[],
  ): Promise<User> {
    const userIsExit = await this.userRepository.findUserByEmail(
      email,
      select,
      relations,
    );

    if (!userIsExit) {
      throw new NotFoundException(
        'User not found',
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    return userIsExit;
  }

  async findUserById(
    userId: string,
    select?: (keyof User)[],
    relations?: (keyof User)[],
  ): Promise<User> {
    const userIsExit = await this.userRepository.findUserById(
      userId,
      select,
      relations,
    );

    if (!userIsExit) {
      throw new NotFoundException(
        'User not found',
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    return userIsExit;
  }

  async updateUser(user: User): Promise<User> {
    const userIsExit = await this.userRepository.findUserById(user.id);

    if (!userIsExit) {
      throw new NotFoundException(
        'User not found',
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    const userUpdated = await this.userRepository.updateUser(user);

    return userUpdated;
  }
}
