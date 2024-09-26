import {
  AuthServiceController,
  AuthServiceControllerMethods,
  GetUserByEmailRequest,
  GetUserByIdRequest,
  GetUserResponse,
  ValidTokenRequest,
  ValidTokenResponse,
} from '@khanhjoi/protos';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { BadRequestException } from '@khanhjoi/protos/dist/errors/http';
import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';

@Controller()
@AuthServiceControllerMethods()
export class AuthGrpcController implements AuthServiceController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getInfoByEmail(
    request: GetUserByEmailRequest,
  ): Promise<GetUserResponse> {
    const user = await this.userService.findUserByEmail(
      request.email,
      ['id', 'email', 'createdAt', 'firstName', 'lastName', 'role'],
      ['role'],
    );

    return {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  async getInfoById(request: GetUserByIdRequest): Promise<GetUserResponse> {
    const user = await this.userService.findUserById(request.userId);

    return {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  async checkValidToken(
    request: ValidTokenRequest,
  ): Promise<ValidTokenResponse> {
    try {
      const payload = await this.jwtService.verifyAsync(request.token, {
        secret: this.configService.get<string>('jwt_secret'),
      });

      return {
        payload: payload,
      };
    } catch (error) {
      throw new BadRequestException(
        `${error}`,
        AuthErrorCode.UNKNOWN_ERROR,
      );
    }
  }
}
