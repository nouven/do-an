import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTUsersTable1680665456500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 't_users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          //{
          //  name: 'username',
          //  type: 'varchar',
          //  length: '255',
          //  isUnique: true,
          //},
          //{
          //  name: 'password',
          //  type: 'varchar',
          //  length: '255',
          //},
          {
            name: 'code',
            type: 'varchar',
            isUnique: true,
            length: '9',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: true,
          },
          //{
          //  name: 'full_name',
          //  type: 'varchar',
          //  length: '255',
          //  isNullable: true,
          //},
          //{
          //  name: 'date_of_birth',
          //  type: 'date',
          //  isNullable: true,
          //},
          //{
          //  name: 'phone',
          //  type: 'varchar',
          //  length: '20',
          //  isNullable: true,
          //},
          //{
          //  name: 'status',
          //  type: 'int',
          //  default: 1,
          //},
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
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('t_users');
  }
}
