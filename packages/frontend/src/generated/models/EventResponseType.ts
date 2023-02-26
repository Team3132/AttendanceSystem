/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EventResponseType = {
  id: string;
  description: string;
  title: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  type: EventResponseType.type;
  roles: Array<string>;
};

export namespace EventResponseType {
  export enum type {
    OUTREACH = "Outreach",
    REGULAR = "Regular",
    SOCIAL = "Social",
  }
}
