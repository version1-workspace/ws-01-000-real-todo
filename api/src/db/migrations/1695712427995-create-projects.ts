import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { withDefaultColumns } from './helper';

const tableName = 'projects';

export class CreateProjects1695712427995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: withDefaultColumns([
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'slug',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'goal',
            type: 'text',
          },
          {
            name: 'shouldbe',
            type: 'text',
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'initial'",
          },
          {
            name: 'deadline',
            type: 'timestamp',
          },
          {
            name: 'startingAt',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'startedAt',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'finishedAt',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'archivedAt',
            type: 'timestamp',
            isNullable: false,
          },
        ]),
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(tableName, true);
  }
}
