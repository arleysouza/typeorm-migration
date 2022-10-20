import { MigrationInterface, QueryRunner } from "typeorm";

export class default1666293316007 implements MigrationInterface {
    name = 'default1666293316007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mail" character varying(70) NOT NULL, "senha" character varying NOT NULL, CONSTRAINT "UQ_76eb67a5fef70ccc191d6dc06c8" UNIQUE ("mail"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gastos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descricao" character varying(50) NOT NULL, "valor" numeric(10,2) NOT NULL, "idusuario" uuid, CONSTRAINT "PK_2b6965305b864a1ed8e6f6bf586" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "gastos" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("idusuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gastos" DROP CONSTRAINT "fk_user_id"`);
        await queryRunner.query(`DROP TABLE "gastos"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }

}
