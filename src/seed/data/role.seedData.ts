export const roleSupperAdminSeedData = {
  id: '5e4d81e7-3403-4ea5-928d-2d735e051801',
  title: 'Super admin',
  description:
    'super admin of application had all permissions to doing anything',
  active: true,
  permissions: ['992cfd77-3014-4a64-a51f-c28189188fc5'],
};

export const roleUserManagerSeedData = {
  id: '93d13875-ae1d-4283-a877-ab1eac71e066',
  title: 'User manager',
  description: 'only available with manager user',
  active: true,
  permissions: [
    '4ba36b4a-f4d4-4b53-b40b-22cf255ef923',
    'b3ed3e96-6938-4261-9f29-0c33d660ad9c',
    'b6d5ff5d-8244-44ac-9f4e-707105bfb777',
    'b261eb72-ebb9-4c3a-bead-01064df00be0',
  ],
};

export const roleRouteManagerSeedData = {
  id: '2f286c56-a68f-4f05-a583-1f3aab1815d1',
  title: 'Route manager',
  description: 'only available with manager route',
  active: true,
  permissions: [
    '88506893-630d-4172-a5dd-69f6fa4a01c4',
    'b4f91232-1300-4fbc-a917-a9c807e89014',
    'cf0e0843-2646-47fa-86b0-00c0218a9b64',
    'e1fbd049-5929-48d5-8a0a-5d0d7fe4be66',
  ],
};

