import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import ical, { ICalAttendeeStatus, ICalCalendarJSONData } from 'ical-generator';
import type { Cache } from 'cache-manager';
@Injectable()
export class CalendarService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private readonly logger = new Logger(CalendarService.name);
  async generateCalendar() {
    const cachedCalendar = await this.cacheManager.get<ICalCalendarJSONData>(
      'calendar',
    );
    if (cachedCalendar) {
      return ical({ ...cachedCalendar });
    } else {
      this.logger.log('Generating Calendar');
      const events = await this.prismaService.event.findMany({
        include: {
          RSVP: {
            include: {
              user: true,
            },
          },
        },
      });
      const calendar = ical({
        name: 'TDU Attendance',
        description: 'The TDU Attendance Calendar',
        events: events.map((event) => {
          return {
            start: event.startDate,
            summary: event.title,
            end: event.endDate,
            description: event.description,
            allDay: event.allDay,
            attendees: event.RSVP.map((rsvp) => {
              const status: ICalAttendeeStatus =
                rsvp.status === 'YES'
                  ? ICalAttendeeStatus.ACCEPTED
                  : rsvp.status === 'MAYBE'
                  ? ICalAttendeeStatus.TENTATIVE
                  : rsvp.status === 'NO'
                  ? ICalAttendeeStatus.DECLINED
                  : ICalAttendeeStatus.NEEDSACTION;

              return {
                name: `${rsvp.user.username}`,
                status,
                email: rsvp.user.id,
              };
            }),
          };
        }),
      });
      await this.cacheManager.set('calendar', calendar.toJSON(), 7200 * 1000);
      return calendar;
    }
  }
}
