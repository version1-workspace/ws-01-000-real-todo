import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { withDefaultColumns } from './helper';

const tableName = 'users';

export class CreateUsers1695695069997 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: withDefaultColumns([
          {
            name: 'username',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'status',
            type: 'varchar',
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
