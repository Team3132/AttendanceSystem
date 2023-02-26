import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class ScancodeService {
  constructor(private readonly prismaService: PrismaService) {}

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

  updateScancode(params: {
    where: Prisma.ScancodeWhereUniqueInput;
    data: Prisma.ScancodeUpdateInput;
  }) {
    const { data, where } = params;
    return this.prismaService.scancode.update({
      data,
      where,
    });
  }

  deleteScancode(where: Prisma.ScancodeWhereUniqueInput) {
    return this.prismaService.scancode.delete({ where });
  }
}
