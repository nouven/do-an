import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnToFilesTable1682668397253 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('files', [
      new TableColumn({
        name: 'mimetype',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'is_signed',
        type: 'int',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('files', [
      new TableColumn({
        name: 'mimetype',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'is_signed',
        type: 'int',
        isNullable: true,
      }),
    ]);
  }
}
