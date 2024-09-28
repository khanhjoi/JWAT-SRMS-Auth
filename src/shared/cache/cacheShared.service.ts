import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { BadRequestException } from '@khanhjoi/protos/dist/errors/http';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class CacheSharedService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getValueByKey(key: string): Promise<User> {
    try {
      const value: any = await this.cacheManager.get(`${key}`);

      return value;
    } catch (error) {
      throw new BadRequestException(error, AuthErrorCode.DATABASE_ERROR);
    }
  }

  async setValue(key: string, user: User): Promise<User> {
    try {
      const value: any = await this.cacheManager.set(`${key}`, user);

      return value;
    } catch (error) {
      throw new BadRequestException(error, AuthErrorCode.DATABASE_ERROR);
    }
  }

  async deleteValue(key: string): Promise<User> {
    try {
      const value: any = await this.cacheManager.del(`${key}`);

      return value;
    } catch (error) {
      throw new BadRequestException(error, AuthErrorCode.DATABASE_ERROR);
    }
  }
}
