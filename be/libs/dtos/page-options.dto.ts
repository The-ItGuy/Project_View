import { NumberField } from '../decorators/field.decorators';

export class PageOptionsDto {
  @NumberField({
    isPositive: true,
    description: 'Starts from 1',
    int: true,
    minimum: 1,
    default: 1,
  })
  page?: number = 1;

  @NumberField({
    isPositive: true,
    int: true,
    minimum: 1,
    maximum: 200,
    default: 10,
  })
  limit?: number = 20;

  // @EnumFieldOptional(() => Order, {
  //   default: Order.ASC,
  // })
  // order: Order = Order.ASC;

  skip(): number {
    // page wise.
    return (this.page - 1) * this.limit;
  }
}
