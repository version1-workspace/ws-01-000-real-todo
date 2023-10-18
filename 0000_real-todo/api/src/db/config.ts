import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';
import { TagTask } from '../relations/tagTask.entity';
import { Tag } from '../tags/tag.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import migrations from '../db/migrations';

export const dataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env['DATABASE_USERNAME'] || 'root',
  password: process.env['DATABASE_PASSWORD'],
  database: process.env['DATABASE_NAME'] || 'todo_develpoment',
  entities: [User, Project, Task, TagTask, Tag],
  migrations,
  synchronize: false,
  logging: true,
  autoLoadEntities: true,
};

export const AppDataSource = new DataSource(
  dataSourceOptions as DataSourceOptions,
);
