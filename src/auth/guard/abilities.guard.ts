import { Reflector } from '@nestjs/core';
import { Mustache } from 'mustache';
import { map, size } from 'lodash';

import {
  subject,
  RawRuleOf,
  ForbiddenError,
  createMongoAbility,
} from '@casl/ability';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { User } from 'src/user/entity/user.entity';
import { EntityManager } from 'typeorm';
import { Role } from 'src/role/entity/role.entity';
import { ConfigService } from '@nestjs/config';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { CHECK_ABILITY, RequiredRule } from 'src/common/decorators/abilities.decorator';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly entityManager: EntityManager,
    private configService: ConfigService,
  ) {}

  createAbility = (rules: RawRuleOf<AppAbility>[]) =>
    createMongoAbility<AppAbility>(rules);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules: any =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    const currentUser: any = context.switchToHttp().getRequest().user;
    const superAdmin = this.configService.get<string>('super_Admin_Id');

    if (currentUser?.roleId === superAdmin) {
      return true;
    }

    const userPermissions = await this.entityManager
      .getRepository(Role)
      .findOne({
        where: {
          id: currentUser.roleId,
        },
        select: {
          permissions: {
            action: true,
            subject: true,
            condition: true,
          },
        },
      });

    const parsedUserPermissions = this.parseCondition(
      userPermissions.permissions,
      currentUser,
    );

    try {
      const ability = this.createAbility(Object(parsedUserPermissions));

      for await (const rule of rules) {
        let sub = {};
        ForbiddenError.from(ability)
          .setMessage('You are not allowed to perform this action')
          .throwUnlessCan(rule.action, subject(rule.subject, sub));
      }
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  parseCondition(permissions: any, currentUser: User) {
    const data = map(permissions, (permission: any) => {
      if (size(permission.conditions)) {
        const parsedVal = Mustache.render(
          permission.conditions['created_by'],
          currentUser,
        );
        return {
          ...permission,
          conditions: { created_by: +parsedVal },
        };
      }
      return permission;
    });
    return data;
  }

  async getSubjectById(id: number, subName: string) {
    const subject = await this.entityManager.getRepository(subName);
    if (!subject) throw new NotFoundException(`${subName} not found`);
    return subject;
  }
}
