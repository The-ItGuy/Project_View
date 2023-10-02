import { SetMetadata, applyDecorators, Injectable } from '@nestjs/common';

export const CUSTOM_REPOSITORY_KEY = 'custom_repository';

export const DatabaseRepository = (entity): ClassDecorator => {
  const decorators = [Injectable(), SetMetadata(CUSTOM_REPOSITORY_KEY, entity)];

  return applyDecorators(...decorators);
};
