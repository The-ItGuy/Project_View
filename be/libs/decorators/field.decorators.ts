/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common';
import ValidatorJS from 'validator';
import type { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Type, TypeHelpOptions } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { isEmpty, isNumber } from 'lodash';
import { ApiEnumProperty, ApiUUIDProperty } from './property.decorators';
import {
  PhoneNumberSerializer,
  ToArray,
  ToBoolean,
  ToLowerCase,
  ToUpperCase,
  Trim,
} from './transform.decorators';
import { IsPassword, IsPhoneNumber, IsTmpKey } from './validator.decorators';

interface IStringFieldOptions {
  minLength?: number;
  maxLength?: number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
  swagger?: boolean;
}

interface INumberFieldOptions {
  each?: boolean;
  minimum?: number;
  maximum?: number;
  int?: boolean;
  isPositive?: boolean;
  swagger?: boolean;
}

interface IFieldOptions {
  swagger?: boolean;
  validation?: boolean;
}

export function NumberField(
  options: Omit<ApiPropertyOptions, 'type'> & INumberFieldOptions = {},
): PropertyDecorator {
  const decorators = [Type(() => Number)];

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const {
    each,
    int,
    minimum,
    maximum,
    isPositive,
    swagger,
    ...swaggerOptions
  } = options;

  if (swagger !== false) {
    decorators.push(
      ApiProperty({
        type: Number,
        minimum,
        maximum,
        example: int === false ? 1.2 : 1,
        ...swaggerOptions,
      }),
    );
  }

  if (each) {
    decorators.push(ToArray());
  }

  if (int) {
    decorators.push(IsInt({ each }));
  } else {
    decorators.push(IsNumber({}, { each }));
  }

  if (isNumber(minimum)) {
    decorators.push(Min(minimum, { each }));
  }

  if (isNumber(maximum)) {
    decorators.push(Max(maximum, { each }));
  }

  if (isPositive) {
    decorators.push(IsPositive({ each }));
  }

  return applyDecorators(...decorators);
}

export function NumberFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{
      each: boolean;
      int: boolean;
      isPositive: boolean;
    }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    NumberField({ required: false, ...options }),
  );
}

export function StringField(
  options: Omit<ApiPropertyOptions, 'type'> &
    IStringFieldOptions & { each?: boolean } = {},
): PropertyDecorator {
  const {
    swagger,
    each,
    toLowerCase,
    toUpperCase,
    isArray,
    ...swaggerOptions
  } = options;

  const decorators = [];

  if (swagger !== false) {
    decorators.push(ApiProperty({ type: String, isArray, ...swaggerOptions }));
  }

  if (isArray) {
    decorators.push(
      IsArray({
        each,
      }),
    );
  }

  decorators.push(
    IsString({
      each: options.isArray || each,
    }),
  );

  decorators.push(Trim());

  if (options?.required !== false) {
    decorators.push(IsNotEmpty());
  }

  if (options?.minLength) {
    decorators.push(MinLength(options.minLength));
  }

  if (options?.maxLength) {
    decorators.push(MaxLength(options.maxLength));
  }

  if (toLowerCase) {
    decorators.push(ToLowerCase());
  }

  if (toUpperCase) {
    decorators.push(ToUpperCase());
  }

  return applyDecorators(...decorators);
}

export function StringFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    StringField({ required: false, ...options }),
  );
}

export function PasswordField(
  options: Omit<ApiPropertyOptions, 'type' | 'minLength'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    StringField({ format: '^[\\d!#$%&*@A-Z^a-z]*$', ...options }),
    IsPassword(),
  );
}

export function PasswordFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'minLength'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    PasswordField({ required: false, ...options }),
  );
}

export function BooleanField(
  options: Omit<ApiPropertyOptions, 'type'> &
    Partial<{ swagger: boolean }> = {},
): PropertyDecorator {
  const decorators = [IsBoolean(), ToBoolean()];

  if (options?.swagger !== false) {
    decorators.push(ApiProperty({ type: Boolean, ...options }));
  }

  return applyDecorators(...decorators);
}

export function BooleanFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{ swagger: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    BooleanField({ required: false, ...options }),
  );
}

export function TmpKeyField(
  options: Omit<ApiPropertyOptions, 'type'> &
    Partial<{ swagger: boolean }> = {},
): PropertyDecorator {
  const decorators = [IsTmpKey()];

  if (options?.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options }));
  }

  return applyDecorators(...decorators);
}

export function TmpKeyFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{ swagger: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    TmpKeyField({ required: false, ...options }),
  );
}

export function EnumField<TEnum>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'enum' | 'enumName'> &
    Partial<{
      each: boolean;
      swagger: boolean;
    }> = {},
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enumValue = getEnum() as any;
  const decorators = [IsEnum(enumValue as object, { each: options.each })];

  if (options?.swagger !== false) {
    decorators.push(ApiEnumProperty(getEnum, options));
  }

  if (options.each) {
    decorators.push(ToArray());
  }

  return applyDecorators(...decorators);
}

export function EnumFieldOptional<TEnum>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'enum' | 'enumName'> &
    Partial<{ each: boolean; swagger: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    EnumField(getEnum, { required: false, ...options }),
  );
}

export function EmailField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    IsEmail(
      {
        allow_display_name: false,
        allow_ip_domain: false,
        require_tld: true,
      },
      {
        each: options.isArray,
      },
    ),
    StringField({ toLowerCase: true, ...options }),
  ];

  if (options?.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options }));
  }

  return applyDecorators(...decorators);
}

export function EmailFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    EmailField({ required: false, ...options }),
    ValidateIf((obj, val) => {
      return !isEmpty(val);
    }),
  );
}

export function PhoneField(
  options: Omit<ApiPropertyOptions, 'type'> &
    Partial<{ swagger: boolean }> = {},
): PropertyDecorator {
  const decorators = [IsPhoneNumber(), PhoneNumberSerializer()];

  if (options?.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options }));
  }

  return applyDecorators(...decorators);
}

export function PhoneFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{ swagger: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    PhoneField({ required: false, ...options }),
  );
}

export function UUIDField(
  options: Omit<ApiPropertyOptions, 'type' | 'format'> &
    Partial<{ each: boolean; swagger: boolean }> = {},
): PropertyDecorator {
  const decorators = [IsUUID('4', { each: options?.each })];

  if (options?.swagger !== false) {
    decorators.push(ApiUUIDProperty(options));
  }

  if (options?.each) {
    decorators.push(ArrayNotEmpty(), ToArray());
  }

  return applyDecorators(...decorators);
}

export function UUIDFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{ each: boolean; swagger: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    UUIDField({ required: false, ...options }),
  );
}

export function URLField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
  urlOptions?: ValidatorJS.IsURLOptions,
): PropertyDecorator {
  return applyDecorators(
    StringField(options),
    IsUrl({ require_tld: false, ...(urlOptions ?? {}) }),
  );
}

export function URLFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
  urlOptions?: ValidatorJS.IsURLOptions,
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    URLField({ required: false, ...options }, urlOptions),
  );
}

export function DateField(
  options: Omit<ApiPropertyOptions, 'type'> & Partial<{ swagger: false }> = {},
): PropertyDecorator {
  const decorators = [Type(() => Date), IsDate()];

  if (options?.swagger !== false) {
    decorators.push(ApiProperty(options));
  }

  return applyDecorators(...decorators);
}

export function DateFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{ swagger: false }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    DateField({ ...options, required: false }),
  );
}

export function ObjectField(
  fieldType: (type?: TypeHelpOptions) => Function,
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator {
  const decorators = [Type(fieldType)];

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { swagger, required, validation, isArray } = options;

  if (required !== false && !isArray) {
    decorators.push(IsNotEmptyObject());
  }

  if (swagger !== false) {
    decorators.push(ApiProperty({ type: fieldType(), ...options }));
  }

  if (validation !== false) {
    decorators.push(ValidateNested({ each: true }));
  }

  if (isArray) {
    decorators.push(IsArray());
  }

  return applyDecorators(...decorators);
}

export function ObjectFieldOptional(
  fieldType: (type?: TypeHelpOptions) => Function,
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    ObjectField(fieldType, { ...options, required: false }),
  );
}

export function FileField(
  options: Omit<ApiPropertyOptions, 'type' | 'format'> & IFieldOptions = {},
): PropertyDecorator {
  const decorators = [];

  if (options?.swagger !== false) {
    decorators.push(
      ApiProperty({ type: String, format: 'binary', ...options }),
    );
  }

  return applyDecorators(...decorators);
}

export function FileFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    FileField({ ...options, required: false }),
  );
}
