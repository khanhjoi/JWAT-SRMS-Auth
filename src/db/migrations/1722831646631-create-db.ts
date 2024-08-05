import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDb1722831646631 implements MigrationInterface {
    name = 'CreateDb1722831646631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "password" character varying NOT NULL, "refreshToken" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "usersId" uuid, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permission" ("roleId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_b42bbacb8402c353df822432544" PRIMARY KEY ("roleId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e3130a39c1e4a740d044e68573" ON "role_permission" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_72e80be86cab0e93e67ed1a7a9" ON "role_permission" ("permissionId") `);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_575c34f4149aee34be69d7f92bd" FOREIGN KEY ("usersId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3130a39c1e4a740d044e685730" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_72e80be86cab0e93e67ed1a7a9a" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_72e80be86cab0e93e67ed1a7a9a"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3130a39c1e4a740d044e685730"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_575c34f4149aee34be69d7f92bd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_72e80be86cab0e93e67ed1a7a9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e3130a39c1e4a740d044e68573"`);
        await queryRunner.query(`DROP TABLE "role_permission"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "permission"`);
    }

}
