/* generated using openapi-typescript-codegen -- do no edit */
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
    SOCIAL = "Social",
    REGULAR = "Regular",
    OUTREACH = "Outreach",
  }
}
