import { User } from '../users/user.entity';
import { DataSource } from 'typeorm';
import { CreateUser1695695069997 } from '../db/migrations/1695695069997-create-user';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env['DATABASE_USERNAME'] || 'root',
  password: process.env['DATABASE_PASSWORD'],
  database: process.env['DATABASE_NAME'] || 'todo_develpoment',
  entities: [User],
  migrations: [CreateUser1695695069997],
  synchronize: false,
  logging: true,
});
