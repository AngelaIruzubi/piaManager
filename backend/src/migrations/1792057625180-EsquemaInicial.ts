import { MigrationInterface, QueryRunner } from "typeorm";

export class EsquemaInicial1792057625180 implements MigrationInterface {
    name = 'EsquemaInicial1792057625180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "apellidos" character varying(150) NOT NULL, "email" character varying(200) NOT NULL, "password" character varying NOT NULL, "rol" character varying(50) NOT NULL, "activo" boolean NOT NULL DEFAULT true, "fecha_alta" date, "fecha_baja" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "personas" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "apellidos" character varying(150) NOT NULL, "fecha_nacimiento" date NOT NULL, "tutor_legal" character varying(200) NOT NULL, "telefono_contacto" character varying(20) NOT NULL, "foto_url" character varying(500), "activo" boolean NOT NULL DEFAULT true, "fecha_alta" date NOT NULL, "fecha_baja" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "profesional_referencia_id" integer, CONSTRAINT "PK_714aa5d028f8f3e6645e971cecd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "asignaciones" ("id" SERIAL NOT NULL, "fecha_inicio" date NOT NULL, "fecha_fin" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "persona_id" integer, "educador_id" integer, CONSTRAINT "PK_6c11ab1a82249192bc2e2763d3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "medios" ("id" SERIAL NOT NULL, "tipo" character varying(50) NOT NULL, "descripcion" text NOT NULL, "responsable" character varying(200), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "objetivo_id" integer, CONSTRAINT "PK_f037b072e8a5b6f50a6be797eec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "seguimientos" ("id" SERIAL NOT NULL, "fecha" date NOT NULL, "porcentaje_logro" integer NOT NULL, "observacion" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "objetivo_id" integer, "registrado_por_id" integer, CONSTRAINT "PK_53f6ee6b1b536e84b9f46dcbe1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "objetivo_pictogramas" ("id" SERIAL NOT NULL, "arasaac_id" integer NOT NULL, "keyword" character varying(200) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "objetivo_id" integer, CONSTRAINT "PK_6d6952b7cb3333ee72e63dd5024" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "objetivos" ("id" SERIAL NOT NULL, "descripcion" text NOT NULL, "plazo" character varying(50) NOT NULL, "estado" character varying(50) NOT NULL DEFAULT 'pendiente', "fecha_inicio" date, "fecha_prevista" date, "fecha_consecucion" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "area_id" integer, CONSTRAINT "PK_5907ecf0f9be78475e62917b3ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "areas" ("id" SERIAL NOT NULL, "tipo" character varying(50) NOT NULL, "observaciones" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "pai_id" integer, CONSTRAINT "PK_5110493f6342f34c978c084d0d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pai" ("id" SERIAL NOT NULL, "anio" integer NOT NULL, "fecha_inicio" date NOT NULL, "fecha_revision" date, "estado" character varying(50) NOT NULL DEFAULT 'borrador', "observaciones_generales" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "persona_id" integer, "creado_por_id" integer, CONSTRAINT "UQ_pai_persona_anio" UNIQUE ("persona_id", "anio"), CONSTRAINT "PK_60147d15a6704cdbcc62ed5ab4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "catalogos" ("id" SERIAL NOT NULL, "tipo" character varying(50) NOT NULL, "codigo" character varying(100) NOT NULL, "descripcion" character varying(200) NOT NULL, "activo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1d78e1f35ded834637978e7cbf2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "personas" ADD CONSTRAINT "FK_f04fe4d2202e21890b94f9484c4" FOREIGN KEY ("profesional_referencia_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asignaciones" ADD CONSTRAINT "FK_82636f5b475161a180fbffa4ee1" FOREIGN KEY ("persona_id") REFERENCES "personas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asignaciones" ADD CONSTRAINT "FK_748db810e8b968e0be63f5ba176" FOREIGN KEY ("educador_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "medios" ADD CONSTRAINT "FK_0b6b821bb8a1bd1e8102c399ccb" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seguimientos" ADD CONSTRAINT "FK_92d55b391009ca704224f0fb60f" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seguimientos" ADD CONSTRAINT "FK_1d13c6cfede7fcb10f6dab885a9" FOREIGN KEY ("registrado_por_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "objetivo_pictogramas" ADD CONSTRAINT "FK_2b500ad8a2afd974f604be27f02" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "objetivos" ADD CONSTRAINT "FK_5ef48412d4610104cefc0deac69" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "areas" ADD CONSTRAINT "FK_3b5ed3f43a1ef33f0a3bfbc5e73" FOREIGN KEY ("pai_id") REFERENCES "pai"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pai" ADD CONSTRAINT "FK_04af6b54161eb41e02f3b4b708b" FOREIGN KEY ("persona_id") REFERENCES "personas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pai" ADD CONSTRAINT "FK_7a6481a1fc49454e71ce526499b" FOREIGN KEY ("creado_por_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pai" DROP CONSTRAINT "FK_7a6481a1fc49454e71ce526499b"`);
        await queryRunner.query(`ALTER TABLE "pai" DROP CONSTRAINT "FK_04af6b54161eb41e02f3b4b708b"`);
        await queryRunner.query(`ALTER TABLE "areas" DROP CONSTRAINT "FK_3b5ed3f43a1ef33f0a3bfbc5e73"`);
        await queryRunner.query(`ALTER TABLE "objetivos" DROP CONSTRAINT "FK_5ef48412d4610104cefc0deac69"`);
        await queryRunner.query(`ALTER TABLE "objetivo_pictogramas" DROP CONSTRAINT "FK_2b500ad8a2afd974f604be27f02"`);
        await queryRunner.query(`ALTER TABLE "seguimientos" DROP CONSTRAINT "FK_1d13c6cfede7fcb10f6dab885a9"`);
        await queryRunner.query(`ALTER TABLE "seguimientos" DROP CONSTRAINT "FK_92d55b391009ca704224f0fb60f"`);
        await queryRunner.query(`ALTER TABLE "medios" DROP CONSTRAINT "FK_0b6b821bb8a1bd1e8102c399ccb"`);
        await queryRunner.query(`ALTER TABLE "asignaciones" DROP CONSTRAINT "FK_748db810e8b968e0be63f5ba176"`);
        await queryRunner.query(`ALTER TABLE "asignaciones" DROP CONSTRAINT "FK_82636f5b475161a180fbffa4ee1"`);
        await queryRunner.query(`ALTER TABLE "personas" DROP CONSTRAINT "FK_f04fe4d2202e21890b94f9484c4"`);
        await queryRunner.query(`DROP TABLE "catalogos"`);
        await queryRunner.query(`DROP TABLE "pai"`);
        await queryRunner.query(`DROP TABLE "areas"`);
        await queryRunner.query(`DROP TABLE "objetivos"`);
        await queryRunner.query(`DROP TABLE "objetivo_pictogramas"`);
        await queryRunner.query(`DROP TABLE "seguimientos"`);
        await queryRunner.query(`DROP TABLE "medios"`);
        await queryRunner.query(`DROP TABLE "asignaciones"`);
        await queryRunner.query(`DROP TABLE "personas"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }

}
