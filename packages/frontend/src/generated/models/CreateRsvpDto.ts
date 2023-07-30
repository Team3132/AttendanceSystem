/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateRsvpDto = {
  eventId: string;
  status: CreateRsvpDto.status;
};

export namespace CreateRsvpDto {
  export enum status {
    LATE = "LATE",
    MAYBE = "MAYBE",
    NO = "NO",
    YES = "YES",
  }
}
