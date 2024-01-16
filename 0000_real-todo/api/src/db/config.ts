import { User } from '../domains/users/user.entity';
import { Project } from '../domains/projects/project.entity';
import { Task } from '../domains/tasks/task.entity';
import { TagTask } from '../domains/relations/tagTask.entity';
import { Tag } from '../domains/tags/tag.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import migrations from '../db/migrations';

export const dataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env['DATABASE_USERNAME'] || 'root',
  password: process.env['DATABASE_PASSWORD'],
  database: process.env['DATABASE_NAME'] || 'todo_development',
  entities: [User, Project, Task, TagTask, Tag],
  migrations,
  synchronize: false,
  logging: true,
  autoLoadEntities: true,
};

export const AppDataSource = new DataSource(
  dataSourceOptions as DataSourceOptions,
);
