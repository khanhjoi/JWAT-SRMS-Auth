import { Reflector } from '@nestjs/core';

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
  ForbiddenException,
} from '@nestjs/common';

import { EntityManager } from 'typeorm';
import { Role } from 'src/role/entity/role.entity';
import { ConfigService } from '@nestjs/config';
import { AppAbility } from 'src/casl/casl-ability.factory/ability.factory';
import {
  CHECK_ABILITY,
  RequiredRule,
} from 'src/common/decorators/abilities.decorator';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly entityManager: EntityManager,
    private configService: ConfigService,
  ) {}

  /**
   * this will return the PureAbility to use for Authentication
   * @param rules list permission
   * @returns
   */
  createAbility = (rules: RawRuleOf<AppAbility>[]) => {
    return createMongoAbility<AppAbility>(rules);
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //get List rule to access function
    const rules: any =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    const currentUser: any = context.switchToHttp().getRequest().user;
    const superAdmin = this.configService.get<string>('super_Admin_Id');


    // pass when user is a super admin
    if (currentUser?.roleId === superAdmin) {
      return true;
    }

    if (!currentUser.roleId) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }


    // current user permission
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

    try {
      const ability = this.createAbility(Object(userPermissions.permissions));

      for await (const rule of rules) {
        let sub = {};

        ForbiddenError.setDefaultMessage(
          (error) =>
            `You are not allowed to ${error.action} on ${error.subjectType}`,
        );

        // if rule not exit in ability => throw error
        ForbiddenError.from(ability).throwUnlessCan(
          rule.action,
          subject(rule.subject, sub),
        );
      }
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
