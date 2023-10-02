import { DynamicModule, Module, Provider } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppConfig } from '../config/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CUSTOM_REPOSITORY_KEY } from './decorators/repository.decorator';

const CONFIG = AppConfig();

export const datasourceConfig = (): DataSourceOptions => ({
  type: 'postgres',
  entities: [
    join(__dirname, '../**/*.entity{.ts,.js}'),
    join(__dirname, '../**/*.view-entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
  url: CONFIG.POSTGRES_URL,
  dropSchema: false,
  synchronize: CONFIG.ORM_SYNCHRONIZE,
  // ssl: CONFIG.POSTGRES_SSL_CA ? { ca: CONFIG.POSTGRES_SSL_CA } : false,
});

@Module({
  imports: [TypeOrmModule.forRoot(datasourceConfig())],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  public static forRepository<T extends new (...args: any[]) => any>(
    repositories: T[],
  ): DynamicModule {
    const providers: Provider[] = [];

    for (const repository of repositories) {
      const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_KEY, repository);

      if (!entity) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken()],
        provide: repository,
        useFactory: (dataSource: DataSource): typeof repository => {
          const baseRepository = dataSource.getRepository<any>(entity);
          return new repository(
            baseRepository.target,
            baseRepository.manager,
            baseRepository.queryRunner,
          );
        },
      });
    }

    return {
      exports: providers,
      module: DatabaseModule,
      providers,
    };
  }
}
