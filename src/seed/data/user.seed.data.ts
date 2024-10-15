import { faker } from '@faker-js/faker';
import { IUser } from '../../user/interface/user.interface';
import { roleClient } from './role.seedData';

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const createFakeUser = (roleId: string) => ({
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  roleId,
});

export const usersData: Array<
  Pick<IUser, 'email' | 'firstName' | 'lastName'> & {
    roleId: string;
  }
> = [
  {
    email: 'Admin@gmail.com',
    firstName: 'Admin',
    lastName: 'Master',
    roleId: '5e4d81e7-3403-4ea5-928d-2d735e051801',
  },
  {
    email: 'routeMaster@gmail.com',
    firstName: 'Route',
    lastName: 'Master',
    roleId: '2f286c56-a68f-4f05-a583-1f3aab1815d1',
  },
  {
    email: 'userMaster@gmail.com',
    firstName: 'User',
    lastName: 'Master',
    roleId: '93d13875-ae1d-4283-a877-ab1eac71e066',
  },
  {
    email: 'portMaster@gmail.com',
    firstName: 'Port',
    lastName: 'Master',
    roleId: 'd88823c9-3b97-43cc-99b5-74055c01f15b',
  },
  {
    email: 'vesselMaster@gmail.com',
    firstName: 'Vessel',
    lastName: 'Master',
    roleId: '13a3d784-62ca-47ba-8c4b-8adce846b249',
  },
  ...Array.from({ length: 20 }, () => createFakeUser(roleClient.id)),
];
