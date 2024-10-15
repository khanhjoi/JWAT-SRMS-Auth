import { Ability } from '@casl/ability';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { EAction } from 'src/common/enums/action.enum';
import { Permission } from 'src/permission/entity/permission.entity';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';

export type PermissionObjectType = any;

export type AppAbility = Ability<[EAction, PermissionObjectType]>;

interface CaslPermission {
  action: EAction;
  subject: string;
}
@Injectable()
export class CaslAbilityFactory {
  constructor(
    private roleService: RoleService,
    private userService: UserService,
  ) {}
  async createForUser(userId: string): Promise<AppAbility> {
    const user = await this.userService.findUserById(userId, ['id']);

    if (!user?.role || !user?.role?.id) {
      throw new ForbiddenException("You don't have permission to access this!");
    }

    const dbPermissions: Permission[] =
      await this.roleService.getPermissionOfRole(user.role.id);

    const caslPermissions: CaslPermission[] = dbPermissions.map((p) => ({
      action: p.action,
      subject: p.subject,
    }));

    return new Ability<[EAction, PermissionObjectType]>(caslPermissions);
  }
}
