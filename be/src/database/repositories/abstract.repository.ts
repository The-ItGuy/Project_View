import { Repository } from 'typeorm';

export abstract class AbstractRepository<TEntity> extends Repository<TEntity> {
  as<T>(): Repository<T> {
    return this as unknown as Repository<T>;
  }
}
