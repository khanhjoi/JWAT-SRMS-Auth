import { MigrationInterface, QueryRunner } from "typeorm";

export class FixColumOfRoleAndPremission1723460474316 implements MigrationInterface {
    name = 'FixColumOfRoleAndPremission1723460474316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3130a39c1e4a740d044e685730"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_72e80be86cab0e93e67ed1a7a9a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e3130a39c1e4a740d044e68573"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_72e80be86cab0e93e67ed1a7a9"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "PK_b42bbacb8402c353df822432544"`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "PK_72e80be86cab0e93e67ed1a7a9a" PRIMARY KEY ("permissionId")`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "PK_72e80be86cab0e93e67ed1a7a9a"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP COLUMN "permissionId"`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD "role_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "PK_3d0a7155eafd75ddba5a7013368" PRIMARY KEY ("role_id")`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD "permission_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "PK_3d0a7155eafd75ddba5a7013368"`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "PK_19a94c31d4960ded0dcd0397759" PRIMARY KEY ("role_id", "permission_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_3d0a7155eafd75ddba5a701336" ON "role_permission" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e3a3ba47b7ca00fd23be4ebd6c" ON "role_permission" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e3a3ba47b7ca00fd23be4ebd6c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d0a7155eafd75ddba5a701336"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "PK_19a94c31d4960ded0dcd0397759"`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "PK_3d0a7155eafd75ddba5a7013368" PRIMARY KEY ("role_id")`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP COLUMN "permission_id"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "PK_3d0a7155eafd75ddba5a7013368"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD "permissionId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "PK_72e80be86cab0e93e67ed1a7a9a" PRIMARY KEY ("permissionId")`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD "roleId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "PK_72e80be86cab0e93e67ed1a7a9a"`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "PK_b42bbacb8402c353df822432544" PRIMARY KEY ("roleId", "permissionId")`);
        await queryRunner.query(`CREATE INDEX "IDX_72e80be86cab0e93e67ed1a7a9" ON "role_permission" ("permissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e3130a39c1e4a740d044e68573" ON "role_permission" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_72e80be86cab0e93e67ed1a7a9a" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3130a39c1e4a740d044e685730" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
