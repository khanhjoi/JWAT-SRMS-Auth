import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const isUserExit = await this.userRepository.findUserByEmail(
      createUserDto.email,
    );

    if (isUserExit) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
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
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return userIsExit;
  }

  async findUserById(userId: string): Promise<User> {
    
    const userIsExit = await this.userRepository.findUserById(userId);

    if (!userIsExit) {
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return userIsExit;
  }

  async updateUserWithRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND,
      );
    }

    // user.refreshToken = refreshToken;

    const updateUser = await this.userRepository.updateUser(user);
  
    return updateUser;
  }
}
