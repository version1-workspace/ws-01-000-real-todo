import { TableColumnOptions, TableIndex } from 'typeorm';
export const withDefaultColumns = (
  columns: TableColumnOptions[],
): TableColumnOptions[] => {
  return [
    {
      name: 'id',
      type: 'int',
      isPrimary: true,
      isGenerated: true,
      generationStrategy: 'increment',
      isUnique: true,
    },
    {
      name: 'uuid',
      type: 'varchar',
      default: '(uuid())',
      isUnique: true,
    },
    ...columns,
    {
      name: 'createdAt',
      type: 'timestamp',
      default: 'now()',
    },
    {
      name: 'updatedAt',
      type: 'timestamp',
      default: 'now()',
    },
  ];
};

export const indexFactory = (
  tableName: string,
  columnNames: string[],
  indexName: string = undefined,
): TableIndex => {
  return new TableIndex({
    name: indexName || `idx_${tableName}_${columnNames.join('_')}`,
    columnNames,
  });
};
