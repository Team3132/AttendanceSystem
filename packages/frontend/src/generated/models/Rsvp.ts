/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Rsvp = {
  id: string;
  eventId: string;
  userId: string;
  status: Rsvp.status | null;
  delay: any;
  createdAt: string;
  updatedAt: string;
  attended: boolean;
};

export namespace Rsvp {
  export enum status {
    YES = "YES",
    NO = "NO",
    MAYBE = "MAYBE",
    LATE = "LATE",
  }
}
