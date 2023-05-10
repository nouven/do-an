import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableTimeLogs1683728936683 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'time_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'started_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'ended_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: true,
            default: 'now()',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: true,
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
            default: null,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('time_logs');
  }
}
