import { Inject, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';

import {
  BadRequestException,
  NotFoundException,
} from '@khanhjoi/protos/dist/errors/http';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CacheSharedService } from '@khanhjoi/protos';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject('CACHE_SERVICE') private cacheService: CacheSharedService,
  ) {}

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

  async findUsersWithRoleId(roleId: string): Promise<User[]> {
    const users = this.userRepository.findUsersWithRoleId(roleId);
    return users;
  }

  async findUserByEmail(
    email: string,
    select?: (keyof User)[],
    relations?: any[], // list relations ['role']
  ): Promise<User> {
    const userCached: any = await this.cacheService.getValueByKey(email);

    if (userCached) {
      return userCached;
    }

    const userIsExist = await this.userRepository.findUserByEmail(
      email,
      select,
      relations,
    );

    if (!userIsExist) {
      throw new NotFoundException(
        'User not found',
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    await this.cacheService.setValue(userIsExist.email, userIsExist);
    await this.cacheService.setValue(userIsExist.id, userIsExist);

    return userIsExist;
  }

  async findUserById(userId: string, select?: (keyof User)[]): Promise<User> {
    const userCached: any = await this.cacheService.getValueByKey(userId);

    if (userCached?.isDelete) {
      throw new BadRequestException(
        'Your account has been deactivated. Please contact the administrator.',
        AuthErrorCode.USER_FIND_FAILED,
      );
    }

    if (userCached) {
      return userCached;
    }

    const userIsExit = await this.userRepository.findUserById(userId, select);

    if (!userIsExit) {
      throw new NotFoundException(
        'User not found',
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    if (userIsExit?.isDelete) {
      throw new BadRequestException(
        'Your account has been deactivated. Please contact the administrator.',
        AuthErrorCode.USER_FIND_FAILED,
      );
    }

    await this.cacheService.setValue(userIsExit.id, userIsExit);
    await this.cacheService.setValue(userIsExit.email, userIsExit);

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

    await this.cacheService.deleteValue(userIsExit.email);
    await this.cacheService.deleteValue(userIsExit.id);

    const userUpdated = await this.userRepository.updateUser(user);

    return userUpdated;
  }

  async updateProfileUser(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const userIsExit = await this.userRepository.findUserById(userId);
    const userHasEmail = await this.userRepository.findUserByEmail(
      updateProfileDto.email,
    );

    if (!userIsExit) {
      throw new NotFoundException(
        'User not found',
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    if (userHasEmail && userHasEmail.email !== userIsExit.email) {
      throw new BadRequestException(
        'Email has already been taken',
        AuthErrorCode.USER_UPDATE_FAILED,
      );
    }

    const getSalt = await bcrypt.genSalt();
    const newHashPassword = await bcrypt.hash(
      updateProfileDto.password,
      getSalt,
    );

    userIsExit.firstName = updateProfileDto.firstName;
    userIsExit.lastName = updateProfileDto.lastName;
    userIsExit.email = updateProfileDto.email;
    userIsExit.password = newHashPassword;

    // delete cache in redis
    await this.cacheService.deleteValue(userIsExit.email);
    await this.cacheService.deleteValue(userIsExit.id);

    const userWasUpdate = await this.userRepository.updateUser(userIsExit);

    return userWasUpdate;
  }
}
