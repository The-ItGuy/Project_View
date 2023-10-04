

import { ErrorDto, SuccessDto } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Interview<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  
  interviewControllerStore = (params: RequestParams = {}) =>
    this.request<SuccessDto, ErrorDto>({
      path: `/api/interview`,
      method: "POST",
      format: "json",
      ...params,
    });
 
  interviewControllerGetAll = (params: RequestParams = {}) =>
    this.request<any, ErrorDto>({
      path: `/api/interview`,
      method: "GET",
      ...params,
    });

  interviewControllerGet = (id: string, params: RequestParams = {}) =>
    this.request<any, ErrorDto>({
      path: `/api/interview/${id}`,
      method: "GET",
      ...params,
    });
}
