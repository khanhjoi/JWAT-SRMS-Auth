import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDeleteForUser1725437439868 implements MigrationInterface {
    name = 'AddIsDeleteForUser1725437439868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isDelete" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isDelete"`);
    }

}
