import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTableKey1684252045948 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE keys ALTER COLUMN type TYPE varchar`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
