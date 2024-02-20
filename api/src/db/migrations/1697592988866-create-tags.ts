import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { withDefaultColumns, indexFactory } from './helper';

const tableName = 'tags';

export class CreateTags1697592988866 implements MigrationInterface {
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
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'enabled'",
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
