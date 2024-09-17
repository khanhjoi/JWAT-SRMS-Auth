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

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const isUserExit = await this.userRepository.findUserByEmail(
      createUserDto.email,
    );

    if (isUserExit && !isUserExit.isDelete) {
      throw new BadRequestException(
        'User already exists',
        AuthErrorCode.USER_CREATE_FAILED,
      );
    }

    if (isUserExit && isUserExit.isDelete) {
      throw new BadRequestException(
        'User was deactivated. Please contact admin for further detail',
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
    relations?: any[], // list relations ['role']
  ): Promise<User> {
    const userExists = await this.userRepository.findUserByEmail(
      email,
      select,
      relations,
    );

    if (!userExists) {
      throw new NotFoundException(
        'User not found',
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    return userExists;
  }

  async findUserById(
    userId: string,
    select?: (keyof User)[],
  ): Promise<User> {
    const userIsExit = await this.userRepository.findUserById(userId, select);

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
