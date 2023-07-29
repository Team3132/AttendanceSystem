import {
  DRIZZLE_TOKEN,
  type DrizzleDatabase,
  NewScancode,
} from '@/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { scancode } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ScancodeService {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase) {}

  async createScancode(data: NewScancode) {
    const multiCodes = await this.db.insert(scancode).values(data).returning();
    return multiCodes.at(0);
  }

  deleteScancode(code: string) {
    return this.db.delete(scancode).where(eq(scancode.code, code)).returning();
  }
}
