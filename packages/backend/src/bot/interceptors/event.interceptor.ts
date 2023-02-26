import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Event } from '@prisma/client';
import { AutocompleteInteraction, CacheType } from 'discord.js';
import { DateTime } from 'luxon';
import { AutocompleteInterceptor } from 'necord';

@Injectable()
export class EventAutocompleteInterceptor extends AutocompleteInterceptor {
  constructor(private readonly db: PrismaService) {
    super();
  }

  public async transformOptions(
    interaction: AutocompleteInteraction<CacheType>,
  ) {
    const focused = interaction.options.getFocused(true);

    const options = await this.db.event.findMany({
      where: {
        title: {
          mode: 'insensitive',
          contains: focused.value.toString(),
        },
        endDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      take: 10,
    });

    const dateEvent = (event: Event) => ({
      name: `${event.title} - ${DateTime.fromJSDate(
        event.startDate,
      ).toLocaleString(DateTime.DATETIME_SHORT)} - ${DateTime.fromJSDate(
        event.endDate,
      ).toLocaleString(DateTime.DATETIME_SHORT)} `,
      value: event.id,
    });

    const datedEvents = options.map(dateEvent);

    interaction.respond(datedEvents);
  }
}
