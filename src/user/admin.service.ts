import { Injectable } from '@nestjs/common';
import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';
import { User } from './entity/user.entity';
import { UserRepository } from './user.repository';
import { UpdateUserByAdminDTO } from './dto/update-user-by-admin.dto';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import {
  BadRequestException,
  NotFoundException,
} from '@khanhjoi/protos/dist/errors/http';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { RoleRepository } from 'src/role/role.repository';

@Injectable()
export class AdminUserService {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
    private roleRepository: RoleRepository,
  ) {}

  async findAllUserWithPagination(
    userQueryPagination: OffsetPaginationDto,
  ): Promise<IOffsetPaginatedType<User>> {
    const users = await this.userRepository.findAllUserWithPagination(
      userQueryPagination,
      ['id', 'lastName', 'firstName', 'email', 'createdAt', 'role', 'isDelete'],
      ['role'],
    );
    return users;
  }

  async updateUser(updateUserByAdminDto: UpdateUserByAdminDTO): Promise<User> {
    const userIsExit = await this.userRepository.findUserById(
      updateUserByAdminDto.id,
    );

    if (!userIsExit) {
      throw new NotFoundException(
        'User Not Found',
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    const userHadEmail = await this.userRepository.findUserByEmail(
      updateUserByAdminDto.email,
    );

    if (userHadEmail && userHadEmail.email !== userIsExit.email) {
      throw new BadRequestException(
        'This email is already taken',
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    userIsExit.email = updateUserByAdminDto.email;
    userIsExit.firstName = updateUserByAdminDto.firstName;
    userIsExit.lastName = updateUserByAdminDto.lastName;

    const getSalt = await bcrypt.genSalt();
    const newHashPassword = await bcrypt.hash(
      updateUserByAdminDto.password,
      getSalt,
    );

    userIsExit.password = newHashPassword;

    const userUpdated = this.userRepository.updateUser(userIsExit);

    return userUpdated;
  }

  async deleteUser(userId: string): Promise<User> {
    const userIsExit = await this.userRepository.findUserById(userId);

    if (!userIsExit) {
      throw new NotFoundException(
        'User not found!',
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    userIsExit.isDelete = true;

    const userDeleted = await this.userRepository.updateUser(userIsExit);

    return userDeleted;
  }

  async activeUser(userId: string): Promise<User> {
    const userIsExit = await this.userRepository.findUserById(userId);

    if (!userIsExit) {
      throw new NotFoundException(
        'User not found!',
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    userIsExit.isDelete = false;

    const userActive = await this.userRepository.updateUser(userIsExit);

    return userActive;
  }

  async assignRole(userId: string, roleId: string): Promise<User> {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException(
        `User ${userId} does not exist`,
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    const role = await this.roleRepository.findRoleById(roleId);

    if (!role) {
      throw new NotFoundException(
        `role ${roleId} does not exist`,
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    user.role = role;

    const userUpdated = await this.userService.updateUser(user);

    return userUpdated;
  }
}
