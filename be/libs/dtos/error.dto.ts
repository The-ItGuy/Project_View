import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  /**
   * Error payload property
   */
  @ApiProperty()
  message?: string | object | Array<string | object>;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  error: string;

  constructor(
    error = 'Internal server error',
    statusCode = 500,
    message?: any,
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
  }
}
