import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResetPasswordEntity1724141669259 implements MigrationInterface {
    name = 'AddResetPasswordEntity1724141669259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reset_password" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expiresAt" TIMESTAMP NOT NULL, "userId" uuid, CONSTRAINT "PK_82bffbeb85c5b426956d004a8f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reset_password" ADD CONSTRAINT "FK_6315a559e0b7920bdbdf142e306" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reset_password" DROP CONSTRAINT "FK_6315a559e0b7920bdbdf142e306"`);
        await queryRunner.query(`DROP TABLE "reset_password"`);
    }

}
