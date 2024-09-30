import {
  AuthServiceController,
  AuthServiceControllerMethods,
  CacheSharedService,
  GetUserByEmailRequest,
  GetUserByIdRequest,
  GetUserResponse,
  ValidTokenRequest,
  ValidTokenResponse,
} from '@khanhjoi/protos';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { BadRequestException } from '@khanhjoi/protos/dist/errors/http';
import { Controller, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

import { UserService } from 'src/user/user.service';

@Controller()
@AuthServiceControllerMethods()
export class AuthGrpcController implements AuthServiceController {
  private readonly logger = new Logger(AuthGrpcController.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('CACHE_SERVICE') private cacheService: CacheSharedService,
  ) {}

  async getInfoByEmail(
    request: GetUserByEmailRequest,
  ): Promise<GetUserResponse> {
    const cacheData: any = await this.cacheService.getValueByKey(request.email);

    if (cacheData) {
      return {
        user: cacheData,
      };
    }
    console.log('call');

    const user = await this.userService.findUserByEmail(
      request.email,
      ['id', 'email', 'createdAt', 'firstName', 'lastName', 'role'],
      ['role'],
    );

    await this.cacheService.setValue(user.id, user);
    await this.cacheService.setValue(user.email, user);

    return {
      user: {
        ...user,
        createdAt:
          user.createdAt instanceof Date
            ? user.createdAt.toISOString()
            : user.createdAt,
      },
    };
  }

  async getInfoById(request: GetUserByIdRequest): Promise<GetUserResponse> {
    const cacheData: any = await this.cacheService.getValueByKey(
      request.userId,
    );

    if (cacheData) {
      return {
        user: cacheData,
      };
    }
    console.log('call');

    const user = await this.userService.findUserById(request.userId);

    await this.cacheService.setValue(user.id, user);
    await this.cacheService.setValue(user.email, user);

    return {
      user: {
        ...user,
        createdAt:
          user.createdAt instanceof Date
            ? user.createdAt.toISOString()
            : user.createdAt,
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
      throw new RpcException(`${error}`);
    }
  }
}
