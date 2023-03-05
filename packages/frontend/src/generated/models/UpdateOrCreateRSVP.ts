/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateOrCreateRSVP = {
  status: UpdateOrCreateRSVP.status;
  delay: number | null;
};

export namespace UpdateOrCreateRSVP {
  export enum status {
    YES = "YES",
    NO = "NO",
    MAYBE = "MAYBE",
    LATE = "LATE",
  }
}
