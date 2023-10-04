

export interface SuccessDto {
  message: string;
  statusCode: number;
}

export interface ErrorDto {
  message: object;
  statusCode: number;
  error: string;
}
