/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type User = {
  id: string;
  username: any;
  createdAt: string;
  updatedAt: string;
  defaultStatus: User.defaultStatus | null;
  calendarSecret: string;
  roles: Array<string>;
};

export namespace User {
  export enum defaultStatus {
    YES = "YES",
    NO = "NO",
    MAYBE = "MAYBE",
  }
}
