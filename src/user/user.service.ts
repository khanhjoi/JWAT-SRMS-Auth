import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import {
  BadRequestException,
  NotFoundException,
} from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

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

  async findUserByEmail(email: string): Promise<User> {
    const userIsExit = await this.userRepository.findUserByEmail(email);

    if (!userIsExit) {
      throw new NotFoundException(
        'User not found',
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    return userIsExit;
  }

  async findUserById(userId: string): Promise<User> {
    const userIsExit = await this.userRepository.findUserById(userId, [
      'id',
      'email',
      'firstName',
      'lastName',
    ]);

    if (!userIsExit) {
      throw new NotFoundException('User not found', AuthErrorCode.USER_NOT_FOUND);
    }

    return userIsExit;
  }
}
