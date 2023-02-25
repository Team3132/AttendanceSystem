/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateScancodeDto } from "../models/CreateScancodeDto";
import type { Scancode } from "../models/Scancode";

import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class ScancodeService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get a scancode by code
   * @param requestBody
   * @returns Scancode
   * @throws ApiError
   */
  public getScancode(
    requestBody: CreateScancodeDto
  ): CancelablePromise<Scancode> {
    return this.httpRequest.request({
      method: "POST",
      url: "/scancode",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * Get a list of all scancodes for the signed in user
   * @returns Scancode
   * @throws ApiError
   */
  public getScancodes(): CancelablePromise<Array<Scancode>> {
    return this.httpRequest.request({
      method: "GET",
      url: "/scancode",
    });
  }

  /**
   * Delete a scancode by code
   * @param id
   * @returns Scancode
   * @throws ApiError
   */
  public deleteScancode(id: string): CancelablePromise<Scancode> {
    return this.httpRequest.request({
      method: "DELETE",
      url: "/scancode/{id}",
      path: {
        id: id,
      },
    });
  }
}
