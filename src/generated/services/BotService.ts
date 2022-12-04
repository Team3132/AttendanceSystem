/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DiscordRole } from "../models/DiscordRole";

import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class BotService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get the status of the bot
   * @returns boolean
   * @throws ApiError
   */
  public getStatus(): CancelablePromise<boolean> {
    return this.httpRequest.request({
      method: "GET",
      url: "/bot/status",
    });
  }

  /**
   * Get the roles in the guild
   * @returns DiscordRole
   * @throws ApiError
   */
  public getRoles(): CancelablePromise<Array<DiscordRole>> {
    return this.httpRequest.request({
      method: "GET",
      url: "/bot/roles",
    });
  }
}
