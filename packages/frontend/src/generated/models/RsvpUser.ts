/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MinimalUser } from "./MinimalUser";

export type RsvpUser = {
  id: string;
  eventId: string;
  userId: string;
  status: RsvpUser.status | null;
  delay: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  attended: boolean;
  user: MinimalUser;
};

export namespace RsvpUser {
  export enum status {
    LATE = "LATE",
    MAYBE = "MAYBE",
    NO = "NO",
    YES = "YES",
  }
}
