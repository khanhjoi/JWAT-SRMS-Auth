import { MigrationInterface, QueryRunner } from 'typeorm';
import { permissionsSeedData } from './data/permission.seedData';

export class SeedPermission1724215117924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const permission of permissionsSeedData) {
      const createdAt = new Date();

      createdAt.setSeconds(
        createdAt.getSeconds() - permissionsSeedData.indexOf(permission),
      );

      await queryRunner.query(
        `
            INSERT INTO "permission" ("id", "title", "action", "subject", "active", "createdAt")
            VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          permission.id,
          permission.title,
          permission.action,
          permission.subject,
          permission.active,
          createdAt,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const permission of permissionsSeedData) {
      await queryRunner.query(
        `
          DELETE FROM "permission" WHERE "id" = $1
        `,
        [permission.id],
      );
    }
  }
}
