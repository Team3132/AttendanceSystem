/** Prod */
export const ROLES =
  process.env.NODE_ENV === 'production'
    ? {
        MENTOR: '605687041228800030',
      }
    : {
        MENTOR: '997106706616176690',
      };

export type ROLE = keyof typeof ROLES;

/** Testing */
// export enum ROLES {
//   MENTOR = '997106706616176690',
// }
