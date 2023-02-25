import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Prisma, RSVPStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RsvpService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(RsvpService.name);
  createRSVP(data: Prisma.RSVPCreateInput) {
    return this.prismaService.rSVP.create({
      data,
    });
  }

  rsvps(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RSVPWhereUniqueInput;
    where?: Prisma.RSVPWhereInput;
    orderBy?: Prisma.RSVPOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.rSVP.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  rsvp(rsvpWhereUniqueInput: Prisma.RSVPWhereUniqueInput) {
    return this.prismaService.rSVP.findUnique({ where: rsvpWhereUniqueInput });
  }

  firstRSVP(rsvpWhereFirstInput: Prisma.RSVPWhereInput) {
    return this.prismaService.rSVP.findFirst({ where: rsvpWhereFirstInput });
  }

  updateRSVP(params: {
    where: Prisma.RSVPWhereUniqueInput;
    data: Prisma.RSVPUpdateInput;
  }) {
    const { data, where } = params;
    return this.prismaService.rSVP.update({
      data,
      where,
    });
  }

  deleteRSVP(where: Prisma.RSVPWhereUniqueInput) {
    return this.prismaService.rSVP.delete({ where });
  }

  upsertRSVP(params: {
    where: Prisma.RSVPWhereUniqueInput;
    create: Prisma.RSVPCreateInput;
    update: Prisma.RSVPUpdateInput;
  }) {
    const { where, update, create } = params;
    return this.prismaService.rSVP.upsert({
      where,
      create,
      update,
    });
  }

  async scanin(params: { code: string; eventId: string }) {
    const { code, eventId } = params;

    const scancode = await this.prismaService.scancode.findUnique({
      where: {
        code,
      },
      select: {
        userId: true,
      },
    });

    if (!scancode) throw new BadRequestException('Not a valid code');

    const { userId } = scancode;

    const rsvp = this.prismaService.rSVP.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      update: {
        attended: true,
      },
      create: {
        attended: true,
        eventId,
        userId,
      },
    });

    return rsvp;
  }

  upsertManyRSVP(userId: string, eventIds: string[], status: RSVPStatus) {
    return Promise.all(
      eventIds.map((eventId) =>
        this.prismaService.rSVP.upsert({
          where: {
            eventId_userId: {
              eventId,
              userId,
            },
          },
          update: {
            eventId,
            userId,
            status,
          },
          create: {
            eventId,
            userId,
            status,
          },
        }),
      ),
    );
  }
}
