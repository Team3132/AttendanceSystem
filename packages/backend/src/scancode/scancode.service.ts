import { DRIZZLE_TOKEN, DrizzleDatabase } from '@/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { scancode } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ScancodeService {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase) {}

  createScancode(data: Prisma.ScancodeCreateInput) {
    return this.prismaService.scancode.create({
      data,
    });
  }

  scancodes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ScancodeWhereUniqueInput;
    where?: Prisma.ScancodeWhereInput;
    orderBy?: Prisma.ScancodeOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.scancode.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  scancode(rsvpWhereUniqueInput: Prisma.ScancodeWhereUniqueInput) {
    return this.prismaService.scancode.findUnique({
      where: rsvpWhereUniqueInput,
    });
  }

  firstScancode(rsvpWhereFirstInput: Prisma.ScancodeWhereInput) {
    return this.prismaService.scancode.findFirst({
      where: rsvpWhereFirstInput,
    });
  }

  deleteScancode(code: string) {
    return this.db.delete(scancode).where(eq(scancode.code, code)).returning();
  }
}
