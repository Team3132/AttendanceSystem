/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class AppService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * A simple hello world just for you.
   * @returns string
   * @throws ApiError
   */
  public helloWorld(): CancelablePromise<string> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api",
    });
  }
}
