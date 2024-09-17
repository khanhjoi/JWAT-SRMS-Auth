import { Action } from 'src/common/enums/action.enum';
import { IPermission } from 'src/permission/interface/permission.interface';
import { IRole } from 'src/role/interface/role.interface';

export class PermissionGetByRoleDTO implements Pick<IPermission, 'action' | 'subject'> {
  action: Action;
  subject: string;
}
