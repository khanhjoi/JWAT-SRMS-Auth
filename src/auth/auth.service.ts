import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
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
import { NotificationClient } from './auth.Client.service';
import { CacheSharedService } from '@khanhjoi/protos';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private notificationClient: NotificationClient,
    @Inject('CACHE_SERVICE') private cacheService: CacheSharedService,
  ) {}

  async login(loginRequestDTO: LoginRequestDTO): Promise<AuthResponse> {
    const user = await this.userService.findUserByEmail(
      loginRequestDTO.email,
      [
        'id',
        'firstName',
        'lastName',
        'createdAt',
        'email',
        'password',
        'isDelete',
      ],
      ['role'],
    );

    if (user.isDelete) {
      throw new BadRequestException(
        'User was deactivated. Please contact admin for further detail',
        AuthErrorCode.UNAUTHORIZED_ACCESS,
      );
    }

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

    console.log('check is exit', isRefreshTokenExit);

    if (isRefreshTokenExit) {
      await this.tokenService.updateRefreshToken(isRefreshTokenExit.id);

      return {
        accessToken: accessToken,
        refreshToken: isRefreshTokenExit.token,
      };
    } else {
      console.log('create', user.id);
      const newToken = await this.tokenService.createRefreshToken(
        user.id,
        refreshToken,
      );

      return {
        accessToken: accessToken,
        refreshToken: newToken.token,
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

    // send email by using kafka
    this.notificationClient.sendWelcomeMail({
      email: newUser.email,
      userName: `${newUser.firstName} ${newUser.lastName}`,
      notificationMessage: 'Welcome to Application',
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshTokens(id: string, token: string): Promise<AuthResponse> {
    const user = await this.userService.findUserById(id, [
      'id',
      'firstName',
      'lastName',
      'email',
      'password',
    ]);

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
    };
  }

  async generateRefreshToken(payload: {
    sub: string;
    roleId?: string;
    permission?: PermissionGetByRoleDTO[];
  }): Promise<TokenType> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
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

      // Send email to user: by provide the link
      this.notificationClient.sendForgotMail({
        email: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        resetPasswordUrl: token.token,
      });
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
    const token = await this.tokenService.findTokenByToken(
      tokenDTO,
      TypeToken.RESET_PASSWORD,
    );

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
    // send email by using kafka
    this.notificationClient.sendResetPasswordSuccess({
      email: user.email,
      userName: `${user.firstName} ${user.lastName}`,
    });
    return {
      message: 'Password updated successfully',
    };
  }

  async logout(userId: string): Promise<void> {
    const token = await this.tokenService.findTokenOfUserId(
      userId,
      TypeToken.REFRESH_TOKEN,
    );

    const user = await this.userService.findUserById(userId);

    if (!token) {
      throw new AuthorizationException(
        'Invalid Token',
        AuthErrorCode.UNAUTHORIZED_ACCESS,
      );
    }

    await this.tokenService.deleteRefreshToken(token.id);
    await this.cacheService.deleteValue(user.email);
    await this.cacheService.deleteValue(user.id);
  }
}
