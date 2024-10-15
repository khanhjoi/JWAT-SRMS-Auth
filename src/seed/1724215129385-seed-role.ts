import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  roleClient,
  rolePortManagerSeedData,
  roleRouteManagerSeedData,
  roleSupperAdminSeedData,
  roleUserManagerSeedData,
  roleVesselManagerSeedData,
} from './data/role.seedData';

function handleCreatedAt(index) {
  let createdAt = new Date();
  createdAt.setSeconds(createdAt.getSeconds() - index);
  return createdAt;
}

export class SeedRole1724215129385 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // super admin
    await queryRunner.query(
      `
            INSERT INTO "role" ("id", "title", "description", "active", "createdAt")
            VALUES ($1, $2, $3, $4, $5)
        `,
      [
        roleSupperAdminSeedData.id,
        roleSupperAdminSeedData.title,
        roleSupperAdminSeedData.description,
        roleSupperAdminSeedData.active,
        handleCreatedAt(1),
      ],
    );

    for (const permissionId of roleSupperAdminSeedData.permissions) {
      await queryRunner.query(
        `
                INSERT INTO "role_permission" ("roleId", "permissionId")
                VALUES ($1, $2)
            `,
        [roleSupperAdminSeedData.id, permissionId],
      );
    }

    // user master
    await queryRunner.query(
      `
            INSERT INTO "role" ("id", "title", "description", "active", "createdAt")
            VALUES ($1, $2, $3, $4, $5)
        `,
      [
        roleUserManagerSeedData.id,
        roleUserManagerSeedData.title,
        roleUserManagerSeedData.description,
        roleUserManagerSeedData.active,
        handleCreatedAt(2),
      ],
    );

    for (const permissionId of roleUserManagerSeedData.permissions) {
      await queryRunner.query(
        `
                INSERT INTO "role_permission" ("roleId", "permissionId")
                VALUES ($1, $2)
            `,
        [roleUserManagerSeedData.id, permissionId],
      );
    }

    // role master
    await queryRunner.query(
      `
            INSERT INTO "role" ("id", "title", "description", "active", "createdAt")
            VALUES ($1, $2, $3, $4, $5)
        `,
      [
        roleRouteManagerSeedData.id,
        roleRouteManagerSeedData.title,
        roleRouteManagerSeedData.description,
        roleRouteManagerSeedData.active,
        handleCreatedAt(3),
      ],
    );

    for (const permissionId of roleRouteManagerSeedData.permissions) {
      await queryRunner.query(
        `
                INSERT INTO "role_permission" ("roleId", "permissionId")
                VALUES ($1, $2)
            `,
        [roleRouteManagerSeedData.id, permissionId],
      );
    }

    // port master
    await queryRunner.query(
      `
            INSERT INTO "role" ("id", "title", "description", "active", "createdAt")
            VALUES ($1, $2, $3, $4, $5)
        `,
      [
        rolePortManagerSeedData.id,
        rolePortManagerSeedData.title,
        rolePortManagerSeedData.description,
        rolePortManagerSeedData.active,
        handleCreatedAt(4),
      ],
    );

    for (const permissionId of rolePortManagerSeedData.permissions) {
      await queryRunner.query(
        `
                INSERT INTO "role_permission" ("roleId", "permissionId")
                VALUES ($1, $2)
            `,
        [rolePortManagerSeedData.id, permissionId],
      );
    }

    // vessel master
    await queryRunner.query(
      `
            INSERT INTO "role" ("id", "title", "description", "active", "createdAt")
            VALUES ($1, $2, $3, $4, $5)
        `,
      [
        roleVesselManagerSeedData.id,
        roleVesselManagerSeedData.title,
        roleVesselManagerSeedData.description,
        roleVesselManagerSeedData.active,
        handleCreatedAt(6),
      ],
    );

    for (const permissionId of roleVesselManagerSeedData.permissions) {
      await queryRunner.query(
        `
                INSERT INTO "role_permission" ("roleId", "permissionId")
                VALUES ($1, $2)
            `,
        [roleVesselManagerSeedData.id, permissionId],
      );
    }

    await queryRunner.query(
      `
            INSERT INTO "role" ("id", "title", "description", "active", "createdAt")
            VALUES ($1, $2, $3, $4, $5)
        `,
      [
        roleClient.id,
        roleClient.title,
        roleClient.description,
        roleClient.active,
        handleCreatedAt(7),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            DELETE FROM "role_permission" WHERE "roleId" IN ($1, $2, $3)
        `,
      [
        roleSupperAdminSeedData.id,
        roleUserManagerSeedData.id,
        roleRouteManagerSeedData.id,
        rolePortManagerSeedData.id,
        roleVesselManagerSeedData.id,
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
        rolePortManagerSeedData.id,
        roleVesselManagerSeedData.id,
      ],
    );
  }
}
