import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { usersData } from './data/user.seed.data';
import { config } from 'dotenv';

config();

export class SeedUser1724215137277 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(process.env.PASSWORD, salt);

    for (const user of usersData) {
      await queryRunner.query(
        `
            INSERT INTO "user" ("email", "firstName", "lastName", "password", "roleId", "createdAt")
            VALUES ($1, $2, $3, $4, $5, NOW())
        `,
        [user.email, user.firstName, user.lastName, passwordHash, user.roleId],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const emails = usersData.map((user) => user.email);

    if (emails.length > 0) {
      const placeholders = emails.map((_, index) => `$${index + 1}`).join(', ');

      await queryRunner.query(
        `
        DELETE FROM "user" WHERE "email" IN (${placeholders})
        `,
        emails,
      );
    }
  }
}
