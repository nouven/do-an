import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterFilesTable1684253528359 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('files', [
      new TableColumn({
        name: 'is_shared',
        type: 'boolean',
        isNullable: true,
        default: false,
      }),
    ]);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('files', [
      new TableColumn({
        name: 'is_shared',
        type: 'boolean',
        isNullable: true,
        default: false,
      }),
    ]);
  }
}
