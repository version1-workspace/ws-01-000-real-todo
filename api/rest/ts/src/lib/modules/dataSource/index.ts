import { DataSource as TypeORMDataSource, EntityManager } from 'typeorm';

export class DataSource {
  private readonly _raw: TypeORMDataSource;
  constructor(ds: TypeORMDataSource) {
    this._raw = ds;
  }

  getManager(): EntityManager {
    return this._raw.manager;
  }
}
