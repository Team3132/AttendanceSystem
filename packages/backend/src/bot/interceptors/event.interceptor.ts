import { DRIZZLE_TOKEN, DrizzleDatabase } from '@/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { Event } from '@prisma/client';
import { AutocompleteInteraction, CacheType } from 'discord.js';
import { and, asc, gte, ilike } from 'drizzle-orm';
import { DateTime } from 'luxon';
import { AutocompleteInterceptor } from 'necord';

@Injectable()
export class EventAutocompleteInterceptor extends AutocompleteInterceptor {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase) {
    super();
  }

  public async transformOptions(
    interaction: AutocompleteInteraction<CacheType>,
  ) {
    const focused = interaction.options.getFocused(true);

    // const options = await this.db.event.findMany({
    //   where: {
    //     title: {
    //       mode: 'insensitive',
    //       contains: focused.value.toString(),
    //     },
    //     endDate: {
    //       gte: new Date(),
    //     },
    //   },
    //   orderBy: {
    //     startDate: 'asc',
    //   },
    //   take: 10,
    // });

    const options = await this.db.query.event.findMany({
      where: (event) =>
        and(
          ilike(event.title, focused.value.toString()),
          gte(event.endDate, new Date()),
        ),
      orderBy: (event) => [asc(event.startDate)],
      limit: 10,
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
