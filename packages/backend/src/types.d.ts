// Override express user

import { User as DrizzleUser } from '@/drizzle/drizzle.module';

declare global {
  namespace Express {
    interface User extends DrizzleUser {
      id: string;
      username: string | null;
      createdAt: Date;
      updatedAt: Date;
      calendarSecret: string;
      defaultStatus: RSVPStatus | null;
      roles: string[];
    }
  }
}
