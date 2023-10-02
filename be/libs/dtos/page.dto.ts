import { ObjectField } from '../decorators/field.decorators';
import { PageMetaDto } from '.';

export class PageDto<T> extends PageMetaDto {
  @ObjectField(() => Object, {
    isArray: true,
  })
  readonly data: T[];

  constructor(data: T[], meta: PageMetaDto) {
    super(meta);
    this.data = data;
  }
}
