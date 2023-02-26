/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TBAEventDto } from "../models/TBAEventDto";

import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class DefaultService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * @returns TBAEventDto
   * @throws ApiError
   */
  public tbaControllerGetNextEvent(): CancelablePromise<TBAEventDto> {
    return this.httpRequest.request({
      method: "GET",
      url: "/tba/events/next",
    });
  }
}
