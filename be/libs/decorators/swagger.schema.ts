import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { IApiFile, IApiFiles } from './file.interface';
import { Type, UseInterceptors, applyDecorators } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import * as _ from 'lodash';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import {
  PARAMTYPES_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';
import { reverseObjectKeys } from '@nestjs/swagger/dist/utils/reverse-object-keys.util';

function explore(instance: object, propertyKey: string | symbol) {
  const types: Array<Type<unknown>> = Reflect.getMetadata(
    PARAMTYPES_METADATA,
    instance,
    propertyKey,
  );
  const routeArgsMetadata =
    Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      instance.constructor,
      propertyKey,
    ) || {};

  const parametersWithType = _.mapValues(
    reverseObjectKeys(routeArgsMetadata),
    (param) => ({
      type: types[param.index],
      name: param.data,
      required: true,
    }),
  );

  for (const [key, value] of Object.entries(parametersWithType)) {
    const keyPair = key.split(':');

    if (Number(keyPair[0]) === RouteParamtypes.BODY) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return value.type;
    }
  }
}

function RegisterModels(): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const body = explore(target, propertyKey);

    return body && ApiExtraModels(body)(target, propertyKey, descriptor);
  };
}

function ApiFileDecorator(
  files: IApiFile[] = [],
  options: Partial<{ isRequired: boolean }> = {},
): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const { isRequired = false } = options;
    const fileSchema: SchemaObject = {
      type: 'string',
      format: 'binary',
    };
    const properties: Record<string, SchemaObject | ReferenceObject> = {};

    for (const file of files) {
      if (file?.isArray) {
        properties[file.name] = {
          type: 'array',
          items: fileSchema,
        };
      } else {
        properties[file.name] = fileSchema;
      }
    }

    let schema: SchemaObject = {
      properties,
      type: 'object',
    };
    const body = explore(target, propertyKey);

    if (body) {
      schema = {
        allOf: [
          {
            $ref: getSchemaPath(body),
          },
          { properties, type: 'object' },
        ],
      };
    }

    return ApiBody({
      schema,
      required: isRequired,
    })(target, propertyKey, descriptor);
  };
}

export function ApiFile(
  files: _.Many<IApiFile>,
  options: Partial<
    { isRequired: boolean; count?: number } & MulterOptions
  > = {},
): MethodDecorator {
  const filesArray = _.castArray(files);
  const apiFileInterceptors = filesArray.map((file) =>
    file.isArray
      ? UseInterceptors(
          FilesInterceptor(file.name, options.count || 1, options),
        )
      : UseInterceptors(FileInterceptor(file.name, options)),
  );

  return applyDecorators(
    RegisterModels(),
    ApiConsumes('multipart/form-data'),
    ApiFileDecorator(filesArray, options),
    ...apiFileInterceptors,
  );
}

export function ApiFiles(files: _.Many<IApiFiles>): MethodDecorator {
  const filesArray = _.castArray(files);
  const apiFileInterceptors = UseInterceptors(
    FileFieldsInterceptor(filesArray),
  );

  return applyDecorators(
    RegisterModels(),
    ApiConsumes('multipart/form-data'),
    apiFileInterceptors,
  );
}
