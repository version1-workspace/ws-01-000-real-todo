import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppDataSource, RootDBDataSource } from '../config';
import { seed } from './seeds';
import { Logger } from '../../lib/modules/logger/logger.service';
import { AppModule } from '../../app.module';

interface ILogger {
  info(...msg: any[]);
  debug(...msg: any[]);
  error(...msg: any[]);
}

type Context = {
  dataSource: DataSource;
  logger: ILogger;
  appFactory: () => Promise<INestApplication>;
};

const commands: { [key: string]: (ctx: Context) => Promise<void> } = {
  create: async ({ dataSource, logger }: Context) => {
    logger.info('create database: ', dataSource.options.database);
    await RootDBDataSource.initialize();
    await RootDBDataSource.manager.query(
      'create database if not exists ' + dataSource.options.database,
    );
    await RootDBDataSource.close();
  },
  reset: async ({ dataSource, logger }: Context) => {
    await dataSource.initialize();
    logger.info('drop database: ', dataSource.options.database);
    await dataSource.dropDatabase();
    logger.info('migration run');
    await dataSource.runMigrations();
    await dataSource.close();
  },
  migrate: async ({ dataSource, logger }: Context) => {
    await dataSource.initialize();
    logger.info('migration run');
    await dataSource.runMigrations();
    await dataSource.close();
  },
  seed: async (context: Context) => {
    const { dataSource } = context;
    await dataSource.initialize();
    await seed(context);
    await dataSource.close();
  },
};

const main = async (command: keyof typeof commands) => {
  const appFactory = () => NestFactory.create(AppModule);
  const logger = new Logger({ level: 'info' });

  try {
    logger.info(`start command: ${command}`);
    const cmd = commands[command];
    if (!cmd) {
      logger.error(`${cmd} is undefined`);
      logger.info(`${Object.keys(commands).join(', ')} is available.`);
      return;
    }

    await cmd({ appFactory, dataSource: AppDataSource, logger } as Context);
    logger.info(`end command.`);
    process.exit();
  } catch (e) {
    logger.error('command is failed', e);
    process.exit(1);
  }
};

main(process.argv[2] as keyof typeof commands);
