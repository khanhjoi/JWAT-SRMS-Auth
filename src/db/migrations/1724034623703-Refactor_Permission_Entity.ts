import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorPermissionEntity1724034623703 implements MigrationInterface {
    name = 'RefactorPermissionEntity1724034623703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "action" "public"."permission_action_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "subject" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "condition" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "condition"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "subject"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "action"`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "description" character varying NOT NULL`);
    }

}
