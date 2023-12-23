/** Prod */
export const ROLES =
  process.env['NODE_ENV'] === 'production'
    ? {
        EVERYONE: '605683682493333507',
        MENTOR: '605687041228800030',
        OUTREACH: '607481539273555978',
        SOCIAL: '607512985136529418',
        STUDENT: '605687349111685130',
      }
    : {
        EVERYONE: '997106706616176690',
        MENTOR: '997106706616176690',
        OUTREACH: '997106706616176690',
        SOCIAL: '997106706616176690',
        STUDENT: '997106706616176690',
      };

export type ROLE = keyof typeof ROLES;

/** Testing */
// export enum ROLES {
//   MENTOR = '997106706616176690',
// }
