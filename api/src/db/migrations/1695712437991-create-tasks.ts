import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { withDefaultColumns, indexFactory } from './helper';

const tableName = 'tasks';

export class CreateTasks1695712437991 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: withDefaultColumns([
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'projectId',
            type: 'int',
          },
          {
            name: 'parentId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'title',
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
            isNullable: true,
          },
          {
            name: 'startedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'finishedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'archivedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ]),
      }),
      true,
    );

    await queryRunner.createIndex(
      tableName,
      indexFactory(tableName, ['userId']),
    );

    await queryRunner.createIndex(
      tableName,
      indexFactory(tableName, ['projectId']),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(tableName, true);
  }
}
