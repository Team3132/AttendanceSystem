import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Event, Prisma } from '@prisma/client';
import { AuthenticatorService } from '@authenticator/authenticator.service';
import { RsvpService } from '@rsvp/rsvp.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authenticatorService: AuthenticatorService,
    private readonly rsvpService: RsvpService,
  ) {}
  private readonly logger = new Logger(EventService.name);

  createEvent(data: Prisma.EventCreateInput) {
    const secret = this.authenticatorService.generateSecret();
    return this.prismaService.event.create({
      data: {
        ...data,
        secret,
      },
    });
  }

  events(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EventWhereUniqueInput;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput;
    include?: Prisma.EventInclude;
    select?: Prisma.EventSelect;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.event.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  event(eventWhereUniqueInput: Prisma.EventWhereUniqueInput): Promise<Event> {
    return this.prismaService.event.findUnique({
      where: eventWhereUniqueInput,
    });
  }

  eventSecret(eventWhereUniqueInput: Prisma.EventWhereUniqueInput) {
    return this.prismaService.event.findUnique({
      where: eventWhereUniqueInput,
      select: {
        secret: true,
      },
    });
  }

  updateEvent(params: {
    where: Prisma.EventWhereUniqueInput;
    data: Prisma.EventUpdateInput;
  }) {
    const { data, where } = params;
    return this.prismaService.event.update({
      data,
      where,
    });
  }

  deleteEvent(id: Event['id']) {
    return this.prismaService.event.delete({ where: { id } });
  }

  async verifyUserEventToken(eventId: string, userId: string, token: string) {
    const event = await this.event({ id: eventId });
    if (!event) throw new NotFoundException('No event found');

    const isValid = this.authenticatorService.verifyToken(event.secret, token);
    if (!isValid) throw new BadRequestException('Code not valid');

    const rsvp = this.rsvpService.upsertRSVP({
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
        event: {
          connect: {
            id: eventId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return rsvp;
  }
}
