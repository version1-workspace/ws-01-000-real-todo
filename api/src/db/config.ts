import { User } from '../domains/users/user.entity';
import { Project } from '../domains/projects/project.entity';
import { Task } from '../domains/tasks/task.entity';
import { TagTask } from '../domains/relations/tagTask.entity';
import { Tag } from '../domains/tags/tag.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import migrations from '../db/migrations';

const database =
  process.env['DATABASE_NAME'] ||
  `todo_${process.env.NODE_ENV || 'development'}`;

export const dataSourceOptions = {
  type: 'mysql',
  host: process.env['DATABASE_HOST'] || 'localhost',
  port: 3306,
  username: process.env['DATABASE_USERNAME'] || 'root',
  password: process.env['DATABASE_PASSWORD'],
  database,
  entities: [User, Project, Task, TagTask, Tag],
  migrations,
  synchronize: false,
  logging: process.env.NODE_ENV !== 'test',
  autoLoadEntities: true,
};

export const RootDBDataSource = (function () {
  return new DataSource({
    ...dataSourceOptions,
    database: 'mysql',
  } as DataSourceOptions);
})();

export const AppDataSource = new DataSource(
  dataSourceOptions as DataSourceOptions,
);
