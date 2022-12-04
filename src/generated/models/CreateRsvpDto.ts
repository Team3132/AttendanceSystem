/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateRsvpDto = {
  eventId: string;
  status: CreateRsvpDto.status;
};

export namespace CreateRsvpDto {
  export enum status {
    YES = "YES",
    NO = "NO",
    MAYBE = "MAYBE",
    ATTENDED = "ATTENDED",
  }
}
