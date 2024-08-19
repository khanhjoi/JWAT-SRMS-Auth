import { Action } from '../../common/enums/action.enum';
import { IPermission } from 'src/permission/entity/permission.interface';

export const permissionsSeedData: Omit<
  IPermission,
  'createdAt' | 'condition'
>[] = [
  {
    id: '992cfd77-3014-4a64-a51f-c28189188fc5',
    title: 'ADMIN_MANAGE',
    action: Action.MANAGER,
    subject: 'all',
    active: true,
  },
  {
    id: '4ba36b4a-f4d4-4b53-b40b-22cf255ef923',
    title: 'USER_READ',
    action: Action.READ,
    subject: 'User',
    active: true,
  },
  {
    id: 'b3ed3e96-6938-4261-9f29-0c33d660ad9c',
    title: 'USER_UPDATE',
    action: Action.UPDATE,
    subject: 'User',
    active: true,
  },
  {
    id: 'b6d5ff5d-8244-44ac-9f4e-707105bfb777',
    title: 'USER_CREATE',
    action: Action.WRITE,
    subject: 'User',
    active: true,
  },
  {
    id: 'b261eb72-ebb9-4c3a-bead-01064df00be0',
    title: 'USER_DELETE',
    action: Action.DELETE,
    subject: 'User',
    active: true,
  },
  {
    id: '88506893-630d-4172-a5dd-69f6fa4a01c4',
    title: 'ROUTE_READ',
    action: Action.READ,
    subject: 'Route',
    active: true,
  },
  {
    id: 'b4f91232-1300-4fbc-a917-a9c807e89014',
    title: 'ROUTE_CREATE',
    action: Action.WRITE,
    subject: 'Route',
    active: true,
  },
  {
    id: 'cf0e0843-2646-47fa-86b0-00c0218a9b64',
    title: 'ROUTE_UPDATE',
    action: Action.UPDATE,
    subject: 'Route',
    active: true,
  },
  {
    id: 'e1fbd049-5929-48d5-8a0a-5d0d7fe4be66',
    title: 'ROUTE_delete',
    action: Action.DELETE,
    subject: 'Route',
    active: true,
  },
];
