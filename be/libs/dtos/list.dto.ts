import { ObjectField } from '../decorators/field.decorators';

export class ListDto<T> {
  @ObjectField(() => Object, {
    isArray: true,
  })
  readonly data: T[];

  constructor(data: T[]) {
    this.data = data;
  }
}
