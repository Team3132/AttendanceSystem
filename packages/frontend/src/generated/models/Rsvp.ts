/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Rsvp = {
  id: string;
  eventId: string;
  userId: string;
  status: Rsvp.status | null;
  delay: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  attended: boolean;
};

export namespace Rsvp {
  export enum status {
    LATE = "LATE",
    MAYBE = "MAYBE",
    NO = "NO",
    YES = "YES",
  }
}
