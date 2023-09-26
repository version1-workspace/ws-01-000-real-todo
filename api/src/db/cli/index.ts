import { DataSource } from 'typeorm';
import { AppDataSource } from '../config';
import { seed } from './seeds';

class Logger {
  info(...msg: any[]) {
    console.log('[INFO]', ...msg);
  }

  debug(...msg: any[]) {
    console.log('[DEBUG]', ...msg);
  }

  error(...msg: any[]) {
    console.log('[ERROR]', ...msg);
  }
}

const logger = new Logger();

interface ILogger {
  info(...msg: any[]);
  debug(...msg: any[]);
  error(...msg: any[]);
}

type Context = {
  dataSource: DataSource;
  logger: ILogger;
};

const commands = {
  reset: async ({ dataSource, logger }: Context) => {
    logger.info('drop database: ', dataSource.options.database);
    await dataSource.dropDatabase();
    logger.info('migration run');
    await dataSource.runMigrations();
  },
  seed,
};

const main = async (command: keyof typeof commands) => {
  try {
    logger.info(`start command: ${command}`);
    await AppDataSource.initialize();
    const cmd = commands[command];
    if (!cmd) {
      logger.error(`${cmd} is undefined`);
      logger.info(`${Object.keys(commands).join(', ')} is available.`);
      return;
    }

    await cmd({ dataSource: AppDataSource, logger } as Context);
    logger.info(`end command.`);
    process.exit();
  } catch (e) {
    logger.error('command is failed', e);
    process.exit(1);
  }
};

main(process.argv[2] as keyof typeof commands);
