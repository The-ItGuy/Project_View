import {
  applyDecorators,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Type,
  UnprocessableEntityException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiResponseMetadata,
} from '@nestjs/swagger';
import { ErrorDto } from 'libs/dtos';
import { isObject } from 'lodash';
import {
  ApiArrayResponse,
  ApiListOkResponse,
  ApiPaginationOkResponse,
} from './api-page-ok-response.decorator';
import { bool } from 'envalid';

const onlyDocumentPublicApi = bool()._parse(
  process.env.SWAGGER_PUBLIC_ONLY ?? 'false',
);

// eslint-disable-next-line @typescript-eslint/ban-types
type ResponseTypeOnly = Type<unknown> | Function | [Function] | string;
type ResponseTypeMeta = {
  dtoType?: 'ListDto' | 'PageDto' | 'ArrayDto';
  type: ResponseTypeOnly;
} & ApiResponseMetadata;

type ResponseType = ResponseTypeOnly | ResponseTypeMeta;

interface IRouteOptions {
  summary?: string;
  description?: string;
  defaultStatus?: HttpStatus;
  Ok?: ResponseType;
  Created?: ResponseType;
  NotFound?: ResponseType;
  Default?: ResponseType;
  BadRequest?: ResponseType;
  ValidationError?: ResponseType;
  ServerError?: ResponseType;
  Forbidden?: ResponseType;
  Unauthorized?: ResponseType;
  NoContent?: ResponseType;
}

export const DEFAULT_VALIDATION_PIPE = () =>
  new ValidationPipe({
    whitelist: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    transform: true,
    enableDebugMessages: true,
    dismissDefaultMessages: true,
    validationError: {
      target: false,
      value: false,
    },
    // forbidUnknownValues: true,
    // stopAtFirstError: false,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors) =>
      new UnprocessableEntityException(errors, 'Validation failed'),
  });

function createApiResponse(
  status: number,
  responseType: ResponseType,
): MethodDecorator {
  let options: ApiResponseMetadata;

  const response =
    'type' in (responseType as object)
      ? (responseType as ResponseTypeMeta)
      : (responseType as ResponseTypeOnly);

  if ('dtoType' in (response as object)) {
    const meta: ResponseTypeMeta = response as ResponseTypeMeta;

    if (meta.dtoType === 'ListDto') {
      return ApiListOkResponse({
        type: meta.type as unknown as any,
        description: meta.description,
      });
    }

    if (meta.dtoType === 'PageDto') {
      return ApiPaginationOkResponse({
        type: meta.type as unknown as any,
        description: meta.description,
      });
    }

    if (meta.dtoType === 'ArrayDto') {
      return ApiArrayResponse({
        type: meta.type as unknown as any,
        description: meta.description,
      });
    }
  }

  if ('type' in (response as object)) {
    const meta: ResponseTypeMeta = response as ResponseTypeMeta;
    options = {
      status,
      ...meta,
    };
  } else {
    options = {
      status,
      type: response as unknown as any,
    };
  }

  return ApiResponse(options);
}

function defaultOptions(options: IRouteOptions): IRouteOptions {
  return {
    ServerError: ErrorDto,
    ...options,
  };
}

function routeOptions(options?: IRouteOptions | ResponseType): IRouteOptions {
  if (options == null) {
    return {};
  }

  if (isObject(options)) {
    return options as unknown as IRouteOptions;
  }

  return {
    Ok: options as unknown as ResponseType,
  };
}

function prepareDecorators(
  _opts?: IRouteOptions | ResponseType,
): MethodDecorator[] {
  const options = defaultOptions(routeOptions(_opts));

  const {
    summary,
    description,
    Ok,
    Created,
    NoContent,
    NotFound,
    Default,
    BadRequest,
    ValidationError,
    ServerError,
    Forbidden,
    Unauthorized,
  } = options;

  const decorators: MethodDecorator[] = [
    HttpCode(options.defaultStatus ?? (Created ? 201 : 200)),
  ];

  decorators.push(UsePipes(DEFAULT_VALIDATION_PIPE()));

  if (summary || description) {
    // const desc = `${description ?? ''}
    // *Roles*: ${rolesString(options.userTypes)}
    // *Permissions*: ${rolesString(options.permissions)}`;
    decorators.push(
      ApiOperation({
        summary,
        description,
      }),
    );
  }

  if (onlyDocumentPublicApi) {
    decorators.push(ApiExcludeEndpoint());
  }

  Ok && decorators.push(createApiResponse(200, Ok));
  Created && decorators.push(createApiResponse(201, Created));
  NoContent && decorators.push(createApiResponse(204, NoContent));
  NotFound && decorators.push(createApiResponse(404, NotFound));
  Default && decorators.push(createApiResponse(200, Default));
  BadRequest && decorators.push(createApiResponse(400, BadRequest));
  ValidationError && decorators.push(createApiResponse(422, ValidationError));
  Forbidden && decorators.push(createApiResponse(403, Forbidden));
  Unauthorized && decorators.push(createApiResponse(401, Unauthorized));
  ServerError && decorators.push(createApiResponse(500, ServerError));

  return decorators;
}

export function GetRoute(
  path?: string | string[],
  options?: IRouteOptions | ResponseType,
): MethodDecorator {
  const decorators: MethodDecorator[] = [Get(path)];
  return applyDecorators(...decorators, ...prepareDecorators(options));
}

export function PostRoute(
  path?: string | string[],
  options?: IRouteOptions | ResponseType,
): MethodDecorator {
  const decorators: MethodDecorator[] = [Post(path)];
  return applyDecorators(...decorators, ...prepareDecorators(options));
}

export function PutRoute(
  path?: string | string[],
  options?: IRouteOptions | ResponseType,
): MethodDecorator {
  const decorators: MethodDecorator[] = [Put(path)];
  return applyDecorators(...decorators, ...prepareDecorators(options));
}

export function DeleteRoute(
  path?: string | string[],
  options?: IRouteOptions | ResponseType,
): MethodDecorator {
  const decorators: MethodDecorator[] = [Delete(path)];
  return applyDecorators(...decorators, ...prepareDecorators(options));
}

export function PatchRoute(
  path?: string | string[],
  options?: IRouteOptions | ResponseType,
): MethodDecorator {
  const decorators: MethodDecorator[] = [Patch(path)];
  return applyDecorators(...decorators, ...prepareDecorators(options));
}
