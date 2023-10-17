import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CreateUsers1695695069997 } from '../db/migrations/1695695069997-create-users';
import { CreateProjects1695712427995 } from '../db/migrations/1695712427995-create-projects';
import { CreateTasks1695712437991 } from '../db/migrations/1695712437991-create-tasks';

export const dataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env['DATABASE_USERNAME'] || 'root',
  password: process.env['DATABASE_PASSWORD'],
  database: process.env['DATABASE_NAME'] || 'todo_develpoment',
  entities: [User, Project],
  migrations: [
    CreateUsers1695695069997,
    CreateProjects1695712427995,
    CreateTasks1695712437991,
  ],
  synchronize: false,
  logging: true,
  autoLoadEntities: true,
};

export const AppDataSource = new DataSource(
  dataSourceOptions as DataSourceOptions,
);
