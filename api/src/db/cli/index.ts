import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { AppDataSource } from '../config';
import { seed } from './seeds';
import { LoggerService } from '../../lib/modules/logger/logger.service';

interface Logger {
  info(...msg: any[]);
  debug(...msg: any[]);
  error(...msg: any[]);
}

type Context = {
  dataSource: DataSource;
  logger: Logger;
  app: INestApplication<any>;
};

const commands: { [key: string]: (ctx: Context) => Promise<void> } = {
  reset: async ({ dataSource, logger }: Context) => {
    logger.info('drop database: ', dataSource.options.database);
    await dataSource.dropDatabase();
    logger.info('migration run');
    await dataSource.runMigrations();
  },
  migrate: async ({ dataSource, logger }: Context) => {
    logger.info('migration run');
    await dataSource.runMigrations();
  },
  seed,
};

const main = async (command: keyof typeof commands) => {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService).logger;

  try {
    logger.info(`start command: ${command}`);
    await AppDataSource.initialize();
    const cmd = commands[command];
    if (!cmd) {
      logger.error(`${cmd} is undefined`);
      logger.info(`${Object.keys(commands).join(', ')} is available.`);
      return;
    }

    await cmd({ app, dataSource: AppDataSource, logger } as Context);
    logger.info(`end command.`);
    process.exit();
  } catch (e) {
    logger.error('command is failed', e);
    process.exit(1);
  }
};

main(process.argv[2] as keyof typeof commands);
