/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { ErrorDto, SuccessDto } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Interview<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Interview
   * @name InterviewControllerStore
   * @request POST:/api/interview
   */
  interviewControllerStore = (params: RequestParams = {}) =>
    this.request<SuccessDto, ErrorDto>({
      path: `/api/interview`,
      method: "POST",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Interview
   * @name InterviewControllerGetAll
   * @request GET:/api/interview
   */
  interviewControllerGetAll = (params: RequestParams = {}) =>
    this.request<any, ErrorDto>({
      path: `/api/interview`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Interview
   * @name InterviewControllerGet
   * @request GET:/api/interview/{id}
   */
  interviewControllerGet = (id: string, params: RequestParams = {}) =>
    this.request<any, ErrorDto>({
      path: `/api/interview/${id}`,
      method: "GET",
      ...params,
    });
}
