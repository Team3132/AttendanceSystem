/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateRangeRSVP = {
  from: string;
  to: string;
  status: UpdateRangeRSVP.status;
};

export namespace UpdateRangeRSVP {
  export enum status {
    YES = "YES",
    NO = "NO",
    MAYBE = "MAYBE",
  }
}
