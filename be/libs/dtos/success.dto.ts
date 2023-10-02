import { ApiProperty } from '@nestjs/swagger';

export class SuccessDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number;

  constructor(message = 'Ok', statusCode = 200) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
