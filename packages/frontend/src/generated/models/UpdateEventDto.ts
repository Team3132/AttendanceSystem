/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateEventDto = {
  description?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  allDay?: boolean;
  type: UpdateEventDto.type;
  roles: Array<string>;
};

export namespace UpdateEventDto {
  export enum type {
    SOCIAL = "Social",
    REGULAR = "Regular",
    OUTREACH = "Outreach",
  }
}
