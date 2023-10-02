import {
  BooleanField,
  NumberField,
  ObjectFieldOptional,
} from '../decorators/field.decorators';
import { PageOptionsDto } from './page-options.dto';
import { LIMIT_DEFAULT, PaginationFilterDto } from './filter.dto';

interface IPageMetaDtoParameters {
  page: number;
  limit: number;
  count: number;
  query?: object;
}

export class PageMetaDto {
  @NumberField({
    int: true,
    example: 1,
    default: 1,
    isPositive: true,
    description: 'Page number. Starts from 1',
  })
  page: number;

  @NumberField({
    int: true,
    example: 10,
    isPositive: true,
    default: LIMIT_DEFAULT,
    description: 'Number of items per page',
  })
  limit: number;

  @NumberField()
  count: number;

  @BooleanField()
  hasMore: boolean;

  @ObjectFieldOptional(() => PaginationFilterDto)
  query?: PaginationFilterDto;

  constructor({ page, limit, count, query }: IPageMetaDtoParameters) {
    this.page = page;
    this.limit = limit;
    this.count = count;
    this.query = query;
    this.hasMore = page * limit < count;
  }

  static fromRequest<T extends PageOptionsDto>(
    dt: T,
    count: number,
  ): PageMetaDto {
    return new PageMetaDto({
      page: dt.page,
      limit: dt.limit,
      query: dt,
      count,
    });
  }

  static fromQuery<T extends PaginationFilterDto>(
    dt: T,
    count: number,
  ): PageMetaDto {
    return new PageMetaDto({
      page: dt.page,
      limit: dt.limit,
      query: dt,
      count,
    });
  }
}
