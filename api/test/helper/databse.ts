import { INestApplication } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

class RollbackError extends Error {}

export const withCleanup = async (
  app: INestApplication<any>,
  cb: (em: EntityManager) => Promise<void>,
) => {
  const dataSource = app.get(getDataSourceToken());
  const manager = dataSource.createEntityManager();
  try {
    await manager.transaction(async (em) => {
      const dataSource: DataSource = app.get(getDataSourceToken());
      jest.replaceProperty(dataSource, 'manager', em);

      await cb(em);

      throw new RollbackError('rollback');
    });
  } catch (e) {
    if (e instanceof RollbackError) {
      return;
    }

    throw e;
  }
};

export const getRepository = (app: INestApplication<any>, token: any) => {
  return app.get(getRepositoryToken(token));
};
