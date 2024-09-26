import { Reflector } from '@nestjs/core';

import {
  subject,
  RawRuleOf,
  ForbiddenError,
  createMongoAbility,
  AbilityBuilder,
  Ability,
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
import {
  CHECK_ABILITY,
  RequiredRule,
} from 'src/common/decorators/abilities.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory/ability.factory';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly entityManager: EntityManager,
    private configService: ConfigService,
  ) {}

  /**
   * This will return the PureAbility to use for Authentication
   * @param rules List of permissions
   * @returns
   */
  createAbility = (rules: RawRuleOf<AppAbility>[]) => {
    const { can, build } = new AbilityBuilder(Ability);

    // Create rules from the provided permissions
    for (const rule of rules) {
      can(rule.action, rule.subject);
    }

    return build();
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get list of rules to access the function
    const rules: any =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    const currentUser: any = context.switchToHttp().getRequest().user;
    const superAdmin = this.configService.get<string>('super_Admin_Id');

    // Pass when user is a super admin
    if (currentUser?.roleId === superAdmin) {
      return true;
    }

    if (!currentUser.roleId) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    // Get current user permissions

    const user = await this.entityManager.getRepository(User).findOne({
      where: {
        id: currentUser.sub,
      },
      relations: {
        role: true,
      },
    });

    try {
      const ability = this.createAbility(Object(user.role.permissions));

      for await (const rule of rules) {
        let sub = {};

        ForbiddenError.setDefaultMessage(
          (error) =>
            `You are not allowed to ${error.action} on ${error.subjectType}`,
        );

        // If rule does not exist in ability => throw error
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
