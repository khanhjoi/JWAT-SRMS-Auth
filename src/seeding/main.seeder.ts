import { Permission } from '../permission/entity/permission.entity';
import { DataSource, In } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';

import { Role } from '../role/entity/role.entity';
import { User } from '../user/entity/user.entity';

import { permissionsSeedData } from './data/permission.seedData';
import {
  roleRouteManagerSeedData,
  roleSupperAdminSeedData,
  roleUserManagerSeedData,
} from './data/role.seedData';

// must be add this config() -> if not it can get .env in app. it will be get env system
config();

export class MainSeeder implements Seeder {
  private readonly logger = new Logger(MainSeeder.name);
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const permissionRepo = dataSource.getRepository(Permission);
    const roleRepo = dataSource.getRepository(Role);
    const userRepo = dataSource.getRepository(User);

    this.logger.verbose(`Seeding permission.....`);
    await permissionRepo.insert(permissionsSeedData);
    this.logger.verbose(`Seeding permission successfully`);

    this.logger.verbose(`Seeding Role.....`);
    const permissionSuperAdmin = await permissionRepo.find({
      where: {
        id: In(roleSupperAdminSeedData.permissions),
      },
    });

    const permissionUserManager = await permissionRepo.find({
      where: {
        id: In(roleUserManagerSeedData.permissions),
      },
    });

    const permissionRouteManager = await permissionRepo.find({
      where: {
        id: In(roleRouteManagerSeedData.permissions),
      },
    });

    const roleSupperAdmin = new Role();
    roleSupperAdmin.title = roleSupperAdminSeedData.title;
    roleSupperAdmin.description = roleSupperAdminSeedData.description;
    roleSupperAdmin.active = roleSupperAdmin.active;
    roleSupperAdmin.permissions = permissionSuperAdmin;

    const roleUserManager = new Role();
    roleUserManager.title = roleUserManagerSeedData.title;
    roleUserManager.description = roleUserManagerSeedData.description;
    roleUserManager.active = roleUserManagerSeedData.active;
    roleUserManager.permissions = permissionUserManager;

    const roleRouteManager = new Role();
    roleRouteManager.title = roleRouteManagerSeedData.title;
    roleRouteManager.description = roleRouteManagerSeedData.description;
    roleRouteManager.active = roleRouteManagerSeedData.active;
    roleRouteManager.permissions = permissionRouteManager;

    const supperAdminRole = await roleRepo.save(roleSupperAdmin);
    await roleRepo.save(roleUserManager);
    await roleRepo.save(roleRouteManager);

    this.logger.verbose(`Seeding Role success`);

    this.logger.verbose(`Seeding User.....`);

    const supperAdmin = new User();
    const getSalt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(process.env.PASSWORD, getSalt);

    supperAdmin.firstName = process.env.FIRST_NAME;
    supperAdmin.lastName = process.env.LAST_NAME;
    supperAdmin.email = process.env.EMAIL;
    supperAdmin.password = hashPassword;
    supperAdmin.role = supperAdminRole;

    await userRepo.save(supperAdmin);
    this.logger.verbose(`Seeding User successfully`);
  }
}
