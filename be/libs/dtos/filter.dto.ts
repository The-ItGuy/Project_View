import {
  BooleanFieldOptional,
  DateFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
  ObjectFieldOptional,
  UUIDFieldOptional,
} from '../decorators/field.decorators';

export const LIMIT_DEFAULT = 200;

export interface INumberFilter {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  // TODO:
  // not?: number;
  eq?: number;
  in?: number[];
  any?: number[];
}

export interface IFilterOperator {
  isnull?: boolean;
  notnull?: boolean;
}

export interface IStringFilter {
  eq?: string;
  // TODO:
  // not?: string;
  like?: string;
  ilike?: string;
}

export interface IDateFilter {
  gt?: Date;
  gte?: Date;
  lt?: Date;
  lte?: Date;
}

export interface IArrayFilter<T> {
  in?: T[];
  notin?: T[];
}

export class BaseFilterOperatorDto {
  @BooleanFieldOptional({
    description: 'Returns null values',
  })
  isnull?: boolean;

  @BooleanFieldOptional({
    description: 'Returns not null values',
  })
  notnull?: boolean;
}

export class DateFilterDto
  extends BaseFilterOperatorDto
  implements IDateFilter
{
  @DateFieldOptional({
    description: 'Returns values greater than the given date',
  })
  gt?: Date;

  @DateFieldOptional({
    description: 'Returns values greater than or equal to the given date',
  })
  gte?: Date;

  @DateFieldOptional({
    description: 'Returns values less than the given date',
  })
  lt?: Date;

  @DateFieldOptional({
    description: 'Returns values less than or equal to the given date',
  })
  lte?: Date;
}

export class NumberFilterDto
  extends BaseFilterOperatorDto
  implements INumberFilter
{
  @NumberFieldOptional({
    description: 'Returns values equal to the given number',
  })
  eq?: number;

  // @NumberFieldOptional()
  // not?: number;

  @NumberFieldOptional({
    description: 'Returns values greater than the given number',
  })
  gt?: number;

  @NumberFieldOptional({
    description: 'Returns values greater than or equal to the given number',
  })
  gte?: number;

  @NumberFieldOptional({
    description: 'Returns values less than the given number',
  })
  lt?: number;

  @NumberFieldOptional({
    description: 'Returns values less than or equal to the given number',
  })
  lte?: number;

  @NumberFieldOptional({
    isArray: true,
    description: 'Returns values in the given array',
  })
  in?: number[];

  @NumberFieldOptional({
    isArray: true,
    description: 'Returns values in the given array',
  })
  any?: number[];
}

export class StringFilterDto
  extends BaseFilterOperatorDto
  implements IStringFilter
{
  @StringFieldOptional({
    description:
      'Returns values that contain the given string using sql LIKE operator',
  })
  like?: string;

  @StringFieldOptional({
    description:
      'Returns values that contain the given string case insensitively using sql ILIKE operator',
  })
  ilike?: string;

  @StringFieldOptional({
    description: 'Returns values equal to the given string',
  })
  eq?: string;
}

export class StringArrayFilterDto
  extends BaseFilterOperatorDto
  implements IArrayFilter<string>
{
  @StringFieldOptional({
    isArray: true,
    description: 'Returns values in the given array',
  })
  in?: string[];

  @StringFieldOptional({
    isArray: true,
    description: 'Returns values not in the given array',
  })
  notin?: string[];
}

export class NumberArrayFilterDto
  extends BaseFilterOperatorDto
  implements IArrayFilter<number>
{
  @NumberFieldOptional({
    isArray: true,
    description: 'Returns values in the given array',
  })
  in?: number[];

  @NumberFieldOptional({
    isArray: true,
    description: 'Returns values not in the given array',
  })
  notin?: number[];
}

export class PaginationFilterDto {
  @NumberFieldOptional({
    example: 1,
    minimum: 1,
    default: 1,
    isPositive: true,
    int: true,
    description: 'Page number. Starts from 1',
  })
  page?: number = 1;

  @NumberFieldOptional({
    example: 10,
    minimum: 1,
    isPositive: true,
    default: LIMIT_DEFAULT,
    maximum: 200,
    int: true,
    description: 'Number of items per page',
  })
  limit?: number = 10;

  @ObjectFieldOptional(() => DateFilterDto, {
    description: 'Filter by created date',
    example: { gt: '2020-01-01' },
  })
  createdAt?: DateFilterDto;
}

export class DefaultResourceFilterDto extends PaginationFilterDto {
  @UUIDFieldOptional({
    isArray: true,
    description: 'Filter by id. Returns items with given ids',
    example: [
      'c3611c05-df51-4b47-b601-f2eac02f4ef0',
      'c3611c05-df51-4b47-b601-f2eac02f4ef2',
    ],
  })
  ids?: string[];
}
