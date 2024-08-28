import { Ability } from '@casl/ability';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Action } from 'src/common/enums/action.enum';
import { Permission } from 'src/permission/entity/permission.entity';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';

export type PermissionObjectType = any;

export type AppAbility = Ability<[Action, PermissionObjectType]>;

interface CaslPermission {
  action: Action;
  subject: string;
}
@Injectable()
export class CaslAbilityFactory {
  constructor(
    private roleService: RoleService,
    private userService: UserService,
  ) {}
  async createForUser(userId: string): Promise<AppAbility> {
    const user = await this.userService.findUserById(userId, ['id'], ['role']);

    if (!user?.role || !user?.role?.id) {
      throw new ForbiddenException("You don't have permission to access this!");
    }

    const dbPermissions: Permission[] =
      await this.roleService.getPermissionOfRole(user.role.id);

    const caslPermissions: CaslPermission[] = dbPermissions.map((p) => ({
      action: p.action,
      subject: p.subject,
    }));

    return new Ability<[Action, PermissionObjectType]>(caslPermissions);
  }
}
