import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { BadRequestException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAllUser(
    select?: (keyof User)[],
    relations?: (keyof User)[],
  ): Promise<User[]> {
    try {
      const users = await this.userRepository.find({
        select: select ? select : undefined,
        relations: relations
          ? relations.reduce(
              (acc, relation) => {
                acc[relation] = true;
                return acc;
              },
              {} as Record<string, boolean>,
            )
          : {},
      });
      return users;
    } catch (error) {
      throw new BadRequestException(
        'Create user failed',
        AuthErrorCode.DATABASE_ERROR,
      );
    }
  }

  async findUserByEmail(
    email: string,
    select?: (keyof User)[],
    relations?: (keyof User)[],
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: select || undefined,
        relations: relations
          ? relations.reduce(
              (acc, relation) => {
                acc[relation] = true;
                return acc;
              },
              {} as Record<string, boolean>,
            )
          : {},
      });

      return user;
    } catch (error) {
      throw new BadRequestException(
        'Failed to find user',
        AuthErrorCode.DATABASE_ERROR,
      );
    }
  }

  async findUserById(
    id: string,
    select?: (keyof User)[],
    relations?: (keyof User)[],
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: select || undefined,
        relations: relations
          ? relations.reduce(
              (acc, relation) => {
                acc[relation] = true;
                return acc;
              },
              {} as Record<string, boolean>,
            )
          : {},
      });
      return user;
    } catch (error) {
      throw new BadRequestException(
        'Failed to find user',
        AuthErrorCode.DATABASE_ERROR,
      );
    }
  }

  async createNewUser(createUserDTO: CreateUserDTO): Promise<User> {
    try {
      const user = await this.userRepository.save(createUserDTO);
      return user;
    } catch (error) {
      throw new BadRequestException(
        'Create user failed',
        AuthErrorCode.DATABASE_ERROR,
      );
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      const userUpdate = await this.userRepository.save(user);
      return userUpdate;
    } catch (error) {
      throw new BadRequestException(
        'Update user failed',
        AuthErrorCode.DATABASE_ERROR,
      );
    }
  }
}
