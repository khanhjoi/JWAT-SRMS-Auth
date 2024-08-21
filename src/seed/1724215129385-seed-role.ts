import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  roleRouteManagerSeedData,
  roleSupperAdminSeedData,
  roleUserManagerSeedData,
} from './data/role.seedData';

export class SeedRole1724215129385 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Seed Super Admin role
    await queryRunner.query(
      `
            INSERT INTO "role" ("id", "title", "description", "active", "createdAt")
            VALUES ($1, $2, $3, $4, NOW())
        `,
      [
        roleSupperAdminSeedData.id,
        roleSupperAdminSeedData.title,
        roleSupperAdminSeedData.description,
        roleSupperAdminSeedData.active,
      ],
    );

    // Insert permissions for Super Admin
    for (const permissionId of roleSupperAdminSeedData.permissions) {
      await queryRunner.query(
        `
                INSERT INTO "role_permission" ("roleId", "permissionId")
                VALUES ($1, $2)
            `,
        [roleSupperAdminSeedData.id, permissionId],
      );
    }

    // Seed User Manager role
    await queryRunner.query(
      `
            INSERT INTO "role" ("id", "title", "description", "active", "createdAt")
            VALUES ($1, $2, $3, $4, NOW())
        `,
      [
        roleUserManagerSeedData.id,
        roleUserManagerSeedData.title,
        roleUserManagerSeedData.description,
        roleUserManagerSeedData.active,
      ],
    );

    // Insert permissions for User Manager
    for (const permissionId of roleUserManagerSeedData.permissions) {
      await queryRunner.query(
        `
                INSERT INTO "role_permission" ("roleId", "permissionId")
                VALUES ($1, $2)
            `,
        [roleUserManagerSeedData.id, permissionId],
      );
    }

    // Seed Route Manager role
    await queryRunner.query(
      `
            INSERT INTO "role" ("id", "title", "description", "active", "createdAt")
            VALUES ($1, $2, $3, $4, NOW())
        `,
      [
        roleRouteManagerSeedData.id,
        roleRouteManagerSeedData.title,
        roleRouteManagerSeedData.description,
        roleRouteManagerSeedData.active,
      ],
    );

    // Insert permissions for Route Manager
    for (const permissionId of roleRouteManagerSeedData.permissions) {
      await queryRunner.query(
        `
                INSERT INTO "role_permission" ("roleId", "permissionId")
                VALUES ($1, $2)
            `,
        [roleRouteManagerSeedData.id, permissionId],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete role and related permissions
    await queryRunner.query(
      `
            DELETE FROM "role_permission" WHERE "roleId" IN ($1, $2, $3)
        `,
      [
        roleSupperAdminSeedData.id,
        roleUserManagerSeedData.id,
        roleRouteManagerSeedData.id,
      ],
    );

    await queryRunner.query(
      `
            DELETE FROM "role" WHERE "id" IN ($1, $2, $3)
        `,
      [
        roleSupperAdminSeedData.id,
        roleUserManagerSeedData.id,
        roleRouteManagerSeedData.id,
      ],
    );
  }
}
