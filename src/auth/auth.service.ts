import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterRequestDTO } from './dto/request/register.dto';
import { LoginRequestDTO } from './dto/request/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse, TokenType } from './dto/response/Auth.dto';
import {
  AuthorizationException,
  BadRequestException,
  NotFoundException,
} from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { Permission } from 'src/permission/entity/permission.entity';
import { PermissionGetByRoleDTO } from 'src/role/dto/response/permission.dto';
import { nanoid } from 'nanoid';
import { TypeToken } from 'src/common/enums/typeToken.enum';
import { TokenService } from 'src/Token/token.service';
import { ResetPasswordDTO } from './dto/response/reset-password.dto';
import { ResetPasswordReqDTO } from './dto/request/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService,
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

    const isRefreshTokenExit = await this.tokenService.findTokenOfUserId(
      user.id,
      TypeToken.REFRESH_TOKEN,
    );

    if (isRefreshTokenExit) {
      await this.tokenService.updateRefreshToken(isRefreshTokenExit.id);
      return {
        accessToken: accessToken,
        refreshToken: isRefreshTokenExit.token,
        userInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      };
    } else {
      const newToken = await this.tokenService.createRefreshToken(
        user.id,
        refreshToken,
      );

      return {
        accessToken: accessToken,
        refreshToken: newToken.token,
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

    const isRefreshTokenExit = await this.tokenService.findTokenOfUserId(
      newUser.id,
      TypeToken.REFRESH_TOKEN,
    );

    if (isRefreshTokenExit) {
      await this.tokenService.updateRefreshToken(isRefreshTokenExit.id);
    } else {
      await this.tokenService.createRefreshToken(newUser.id, refreshToken);
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
    const user = await this.userService.findUserByEmail(
      email,
      ['id', 'firstName', 'lastName', 'email', 'password'],
      ['role'],
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const refreshTokenDB = await this.tokenService.findTokenOfUserId(
      user.id,
      TypeToken.REFRESH_TOKEN,
    );

    if (!refreshTokenDB || refreshTokenDB.token !== token) {
      throw new ForbiddenException('User not Authenticated');
    }

    const { accessToken, refreshToken } = await this.generateRefreshToken({
      sub: user.id,
      roleId: user?.role?.id || '',
      permission: user?.role?.permissions
        ? await this.getPermissions(user.role.permissions)
        : [],
    });

    await this.tokenService.updateRefreshToken(refreshTokenDB.id, refreshToken);

    return {
      accessToken,
      refreshToken: refreshTokenDB.token,
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

    const refreshToken = nanoid();

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

  async forgotPassword(email: string): Promise<ResetPasswordDTO> {
    const user = await this.userService.findUserByEmail(email);

    if (user) {
      const resetPasswordToken = nanoid(64);

      const token = await this.tokenService.createResetToken(
        user.id,
        resetPasswordToken,
      );

      console.log(token);
      // Send email to user: by provide the link
    }

    return {
      message: 'Please Check mail, if your email is valid!!',
    };
  }

  async resetPassword(
    tokenDTO: string,
    resetPassword: ResetPasswordReqDTO,
  ): Promise<{
    message: string;
  }> {
    const token = await this.tokenService.findTokenByToken(tokenDTO);

    if (!token || token.expiresAt <= new Date()) {
      throw new AuthorizationException(
        'Invalid Link',
        AuthErrorCode.UNAUTHORIZED_ACCESS,
      );
    }

    const user = await this.userService.findUserById(token?.user.id);

    if (!user) {
      throw new NotFoundException(
        'User not found',
        AuthErrorCode.USER_NOT_FOUND,
      );
    }

    const salt = await bcrypt.genSalt();
    const newPassword = await bcrypt.hash(resetPassword.newPassword, salt);

    user.password = newPassword;

    await this.userService.updateUser(user);
    await this.tokenService.deleteResetToken(token.id);

    return {
      message: 'Password updated successfully',
    };
  }
}
