/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MinimalUser } from "./MinimalUser";

export type RsvpUser = {
  id: string;
  eventId: string;
  userId: string;
  status: RsvpUser.status | null;
  delay: any;
  createdAt: string;
  updatedAt: string;
  attended: boolean;
  user: MinimalUser;
};

export namespace RsvpUser {
  export enum status {
    YES = "YES",
    NO = "NO",
    MAYBE = "MAYBE",
    LATE = "LATE",
  }
}
