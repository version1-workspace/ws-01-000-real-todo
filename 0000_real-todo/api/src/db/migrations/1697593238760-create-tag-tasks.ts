import { MigrationInterface, QueryRunner, Table } from "typeorm"
import { withDefaultColumns, indexFactory } from './helper';

const tableName = 'tagTasks';

export class CreateTagTasks1697593238760 implements MigrationInterface {
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
            name: 'tagId',
            type: 'int',
          },
          {
            name: 'taskId',
            type: 'int',
          },
        ]),
      }),
      true,
    );

    await queryRunner.createIndex(
      tableName,
      indexFactory(tableName, ['userId']),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(tableName, true);
  }
}
