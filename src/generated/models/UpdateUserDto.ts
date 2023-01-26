/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateUserDto = {
  defaultStatus?: UpdateUserDto.defaultStatus;
};

export namespace UpdateUserDto {
  export enum defaultStatus {
    YES = "YES",
    NO = "NO",
    MAYBE = "MAYBE",
  }
}
