import {
  DRIZZLE_TOKEN,
  Event,
  type DrizzleDatabase,
} from '@/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { AutocompleteInteraction, CacheType } from 'discord.js';
import { asc, gte } from 'drizzle-orm';
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
    // const focused = interaction.options.getFocused(true);

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
      where: (event) => gte(event.endDate, DateTime.local().toISO()),

      orderBy: (event) => [asc(event.startDate)],
      limit: 10,
    });

    const dateEvent = (event: Event) => ({
      name: `${event.title} - ${DateTime.fromISO(
        event.startDate,
      ).toLocaleString(DateTime.DATETIME_SHORT)} - ${DateTime.fromISO(
        event.endDate,
      ).toLocaleString(DateTime.DATETIME_SHORT)} `,
      value: event.id,
    });

    const datedEvents = options.map(dateEvent);

    interaction.respond(datedEvents);
  }
}
