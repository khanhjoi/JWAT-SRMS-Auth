
import { IPermission } from 'src/permission/entity/permission.interface';

export const permissionsSeedData: Omit<IPermission, 'createdAt'>[] = [
  {
    id: '992cfd77-3014-4a64-a51f-c28189188fc5',
    title: 'ADMIN_READ',
    description: 'Super admin read',
    active: true,
  },
  {
    id: '4ba36b4a-f4d4-4b53-b40b-22cf255ef923',
    title: 'ADMIN_CREATE',
    description: 'Super admin create',
    active: true,
  },
  {
    id: 'b3ed3e96-6938-4261-9f29-0c33d660ad9c',
    title: 'ADMIN_UPDATE',
    description: 'Super admin edit',
    active: true,
  },
  {
    id: 'b6d5ff5d-8244-44ac-9f4e-707105bfb777',
    title: 'ADMIN_DELETE',
    description: 'Super admin delete',
    active: true,
  },
  {
    id: 'b261eb72-ebb9-4c3a-bead-01064df00be0',
    title: 'USER_MANAGE_READ',
    description: 'user manager read',
    active: true,
  },
  {
    id: '88506893-630d-4172-a5dd-69f6fa4a01c4',
    title: 'USER_MANAGE_CREATE',
    description: 'user manager create',
    active: true,
  },
  {
    id: 'b4f91232-1300-4fbc-a917-a9c807e89014',
    title: 'USER_MANAGE_UPDATE',
    description: 'user manager edit',
    active: true,
  },
  {
    id: 'cf0e0843-2646-47fa-86b0-00c0218a9b64',
    title: 'USER_MANAGE_DELETE',
    description: 'user manager delete',
    active: true,
  },
];
