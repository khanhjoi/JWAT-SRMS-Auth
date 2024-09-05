import { IUser } from '../../user/entity/user.interface';

export const usersData: Array<
  Pick<IUser, 'email' | 'firstName' | 'lastName'> & {
    roleId: string;
  }
> = [
  {
    email: 'Admin@gmail.com',
    firstName: 'Admin',
    lastName: 'Master',
    roleId: '5e4d81e7-3403-4ea5-928d-2d735e051801', // Super admin role ID
  },
  {
    email: 'routeMaser@gmail.com',
    firstName: 'Route',
    lastName: 'Master',
    roleId: '2f286c56-a68f-4f05-a583-1f3aab1815d1', // Route manager role ID
  },
  {
    email: 'userMaster@gmail.com',
    firstName: 'User',
    lastName: 'Master',
    roleId: '93d13875-ae1d-4283-a877-ab1eac71e066', // User manager role ID
  },
];
