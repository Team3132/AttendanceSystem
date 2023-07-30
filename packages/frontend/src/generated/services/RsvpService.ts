/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRsvpDto } from "../models/CreateRsvpDto";
import type { Rsvp } from "../models/Rsvp";
import type { UpdateRsvpDto } from "../models/UpdateRsvpDto";

import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class RsvpService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Create an RSVP
   * @param requestBody
   * @returns Rsvp
   * @throws ApiError
   */
  public createRsvp(requestBody: CreateRsvpDto): CancelablePromise<Rsvp> {
    return this.httpRequest.request({
      method: "POST",
      url: "/api/rsvp",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * Get a specific RSVP
   * @param id
   * @returns Rsvp
   * @throws ApiError
   */
  public getRsvp(id: string): CancelablePromise<Rsvp> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/rsvp/{id}",
      path: {
        id: id,
      },
    });
  }

  /**
   * Edit a specific RSVP
   * @param id
   * @param requestBody
   * @returns Rsvp
   * @throws ApiError
   */
  public editRsvp(
    id: string,
    requestBody: UpdateRsvpDto
  ): CancelablePromise<Rsvp> {
    return this.httpRequest.request({
      method: "PATCH",
      url: "/api/rsvp/{id}",
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * Delete an RSVP
   * @param id
   * @returns Rsvp
   * @throws ApiError
   */
  public deleteRsvp(id: string): CancelablePromise<Rsvp> {
    return this.httpRequest.request({
      method: "DELETE",
      url: "/api/rsvp/{id}",
      path: {
        id: id,
      },
    });
  }
}
