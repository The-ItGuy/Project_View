import { FindOperator, ValueTransformer } from 'typeorm';

export const LowerCaseTransformer: ValueTransformer = {
  to: (entityValue: string | FindOperator<string>) => {
    if (entityValue instanceof FindOperator) {
      return new FindOperator(
        entityValue.type,
        Array.isArray(entityValue.value)
          ? entityValue.value.map((value) => value.toLocaleLowerCase())
          : entityValue.value.toLocaleLowerCase(),
        entityValue.useParameter,
        entityValue.multipleParameters,
      );
    } else {
      return entityValue && entityValue.toLocaleLowerCase();
    }
  },
  from: (databaseValue: string) => {
    return databaseValue;
  },
};
