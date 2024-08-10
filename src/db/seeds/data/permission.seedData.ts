import { create } from 'domain';
import { title } from 'process';
import { IPermission } from 'src/permission/entity/permission.interface';

export const permissions: Omit<IPermission, 'createdAt'>[] = [
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
    title: 'ADMIN_EDIT',
    description: 'Super admin edit',
    active: true,
  },
  {
    id: 'b6d5ff5d-8244-44ac-9f4e-707105bfb777',
    title: 'ADMIN_DELETE',
    description: 'Super admin delete',
    active: true,
  },
];
