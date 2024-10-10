// mocks/permission.data.mock.ts
import { Permission } from '@/permission/entity/permission.entity';
import { Action } from '@common/enums/action.enum';
import { InjectRepoMock } from 'test/common/mockType.interface.test';

export const mockPermission: Permission = {
  id: '1',
  title: 'View Dashboard',
  action: Action.MANAGER,
  active: true,
  condition: null,
  subject: 'User',
  createdAt: new Date(),
};

export const mockPermissions: Permission[] = [mockPermission];

// mocks/permission.repository.mock.ts
export const permissionInjectRepoMock =
  InjectRepoMock<Permission>(mockPermissions);
