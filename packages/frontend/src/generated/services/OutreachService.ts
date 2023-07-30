/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeaderboardDto } from "../models/LeaderboardDto";

import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class OutreachService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * @returns LeaderboardDto
   * @throws ApiError
   */
  public outreachControllerGetOutreachLeaderboard(): CancelablePromise<
    Array<LeaderboardDto>
  > {
    return this.httpRequest.request({
      method: "GET",
      url: "/outreach/leaderboard",
    });
  }
}
