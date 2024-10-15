import { CreateRoleDTO } from '@/role/dto/request/create-role.dto';
import { Role } from '@/role/entity/role.entity';
import { EAction } from '@common/enums/action.enum';
import { IOffsetPaginatedType } from '@common/interface/offsetPagination.interface';
import { User } from 'src/user/entity/user.entity';

export type MockRoleType = Omit<User['role'], ''>;
export type MockUser = Omit<User, 'role' | 'tokens'>;

export const mockRole: Role = {
  id: '1',
  title: 'User Manager',
  description: 'only available with manager user',
  active: true,
  createdAt: new Date('2024-09-19T12:13:20.329Z'),
  users: [],
  permissions: [
    {
      id: '1',
      action: EAction.READ,
      active: true,
      condition: null,
      createdAt: new Date('2024-09-19T12:13:20.329Z'),
      subject: 'User',
      title: 'Read User',
    },
  ],
};

export const mockRoles: Role[] = [
  {
    id: '1',
    title: 'User Manager',
    description: 'only available with manager user',
    active: true,
    createdAt: new Date('2024-09-19T12:13:20.329Z'),
    users: [
      {
        id: '1132e528-c197-48a9-828d-004f1c52b028',
        email: 'userMaster@gmail.com',
        firstName: 'User',
        lastName: 'Master',
        password: '',
        tokens: null,
        createdAt: new Date('2024-10-02T11:55:11.603Z'),
        isDelete: false,
        role: null,
      },
    ],
    permissions: [
      {
        id: '1',
        action: EAction.READ,
        active: true,
        condition: null,
        createdAt: new Date('2024-09-19T12:13:20.329Z'),
        subject: 'User',
        title: 'Read User',
      },
    ],
  },
  {
    id: '2',
    title: 'Client Manager',
    description: 'only available with manager user',
    active: true,
    createdAt: new Date('2024-09-19T12:13:20.329Z'),
    users: [],
    permissions: null,
  },
  {
    id: '3',
    title: 'client',
    description: 'only available with manager user',
    active: true,
    createdAt: new Date('2024-09-19T12:13:20.329Z'),
    users: [],
    permissions: null,
  },
];

export const mockCreateRoleDto: CreateRoleDTO = {
  title: 'User',
  description: 'User Role',
};
