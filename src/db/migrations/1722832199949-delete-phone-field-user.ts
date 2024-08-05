import { MigrationInterface, QueryRunner } from "typeorm";

export class DeletePhoneFieldUser1722832199949 implements MigrationInterface {
    name = 'DeletePhoneFieldUser1722832199949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying NOT NULL`);
    }

}
