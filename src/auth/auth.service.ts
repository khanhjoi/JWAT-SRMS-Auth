import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { LoginRequestDTO } from './dto/request/login-request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse, TokenType } from './dto/response/Auth-response';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenService } from 'src/Token/refreshToken.service';
import {
  BadRequestException,
  NotFoundException,
} from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { Permission } from 'src/permission/entity/permission.entity';
import { PermissionGetByRoleDTO } from 'src/role/dto/response/permission.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async login(loginRequestDTO: LoginRequestDTO): Promise<AuthResponse> {
    const user = await this.userService.findUserByEmail(
      loginRequestDTO.email,
      ['id', 'firstName', 'lastName', 'email', 'password'],
      ['role'],
    );

    const isMatchPassword = await bcrypt.compare(
      loginRequestDTO?.password,
      user?.password,
    );

    if (!isMatchPassword) {
      throw new BadRequestException(
        'Invalid password',
        AuthErrorCode.INPUT_IS_NOT_VALID,
      );
    }

    let { accessToken, refreshToken } = await this.generateRefreshToken({
      sub: user?.id,
      roleId: user?.role?.id || '',
      permission: user?.role?.permissions
        ? await this.getPermissions(user.role.permissions)
        : [],
    });

    const isRefreshTokenExit = await this.refreshTokenService.findTokenOfUserId(
      user.id,
    );

    if (isRefreshTokenExit) {
      await this.refreshTokenService.updateRefreshToken(isRefreshTokenExit.id);

      return {
        accessToken: accessToken,
        refreshToken: isRefreshTokenExit.id,
        userInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      };
    } else {
      await this.refreshTokenService.createRefreshToken(refreshToken, user.id);
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        userInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      };
    }
  }

  async register(registerDto: RegisterRequestDTO): Promise<AuthResponse> {
    const newUser = await this.userService.createUser(registerDto);

    const { accessToken, refreshToken } = await this.generateRefreshToken({
      sub: newUser.id,
    });

    const isRefreshTokenExit = await this.refreshTokenService.findTokenOfUserId(
      newUser.id,
    );

    if (isRefreshTokenExit) {
      await this.refreshTokenService.updateRefreshToken(isRefreshTokenExit.id);
    } else {
      await this.refreshTokenService.createRefreshToken(
        refreshToken,
        newUser.id,
      );
    }

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      userInfo: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    };
  }

  async refreshTokens(email: string, token: string): Promise<AuthResponse> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const refreshTokenDB = await this.refreshTokenService.findTokenOfUserId(
      user.id,
    );

    if (!refreshTokenDB || refreshTokenDB.id !== token) {
      throw new ForbiddenException('User not Authenticated');
    }

    const { accessToken, refreshToken } = await this.generateRefreshToken({
      sub: user.id,
    });

    await this.refreshTokenService.updateRefreshToken(refreshTokenDB.id);

    return {
      accessToken,
      refreshToken: refreshTokenDB.id,
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  async generateRefreshToken(payload: {
    sub: string;
    roleId?: string;
    permission?: PermissionGetByRoleDTO[];
  }): Promise<TokenType> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
    });

    const refreshToken = await uuidv4();

    return {
      accessToken,
      refreshToken,
    };
  }

  async getPermissions(
    permissions: Permission[],
  ): Promise<PermissionGetByRoleDTO[]> {
    let permissionDTO = [];

    for (const permission of permissions) {
      permissionDTO.push({
        action: permission.action,
        subject: permission.subject,
      });
    }

    return permissionDTO;
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException(
        `User ${userId} not found`,
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    const isMatchPassword = await bcrypt.compare(oldPassword, user?.password);

    if (!isMatchPassword) {
      throw new BadRequestException(
        'Password is not match',
        AuthErrorCode.USER_UPDATE_FAILED,
      );
    }

    const getSalt = await bcrypt.genSalt();
    const newPasswordHash = await bcrypt.hash(newPassword, getSalt);

    user.password = newPasswordHash;

    const userUpdate = await this.userService.updateUser(user);

    return userUpdate;
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findUserByEmail(email);

    if (user) {
      const resetToken = nanoid(64);
      console.log(resetToken);
    }

    return '';
  }
}
