import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { BadRequestException, NotFoundException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';

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
      throw new BadRequestException('Create user failed', AuthErrorCode.DATABASE_ERROR);
    }
  }

  async findUserByEmail(
    email: string,
    select?: (keyof User)[],
    relations?: boolean,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
        select: select ? select : undefined,
      });
      return user;
    } catch (error) {
      throw new BadRequestException('Find user failed', AuthErrorCode.DATABASE_ERROR);

    }
  }

  async findUserById(
    id: string,
    select?: (keyof User)[],
    relations?: boolean,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id },
        select: select ? select : undefined,
        relations: {
          role: true,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Find user failed', AuthErrorCode.DATABASE_ERROR);
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      const userUpdate = await this.userRepository.save(user);
      return userUpdate;
    } catch (error) {
      throw new BadRequestException('Update user failed', AuthErrorCode.DATABASE_ERROR);
    }
  }
}
