import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PermissionFlagsBits } from 'discord.js';
import { SlashCommand, Context, SlashCommandContext, Options } from 'necord';
import { RequestRSVPDto } from '../dto/requestRSVP.dto';
import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';
import rsvpReminderMessage from '../utils/rsvpReminderMessage';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';

@Injectable()
export class RequestRsvpCommand {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    private readonly config: ConfigService,
  ) {}

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'requestrsvp',
    description: 'Send a message for people to RSVP to a specific event.',
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
    guilds: [process.env['GUILD_ID']],
  })
  public async onRequestRSVP(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting }: RequestRSVPDto,
  ) {
    // const event = await this.db.event.findUnique({
    //   where: {
    //     id: meeting,
    //   },
    //   include: {
    //     RSVP: {
    //       orderBy: {
    //         updatedAt: 'asc',
    //       },
    //       include: {
    //         user: {
    //           select: {
    //             username: true,
    //             roles: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
    const fetchedEvent = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, meeting),
    });

    const fetchedRSVPs = await this.db.query.rsvp.findMany({
      where: (rsvp, { eq }) => eq(rsvp.eventId, meeting),
      orderBy: (rsvp) => [rsvp.status, rsvp.updatedAt],
      with: {
        user: {
          columns: {
            username: true,
            roles: true,
          },
        },
      },
    });

    if (!fetchedEvent)
      return interaction.reply({
        ephemeral: true,
        content: 'No meeting with that Id',
      });

    return interaction.reply(
      rsvpReminderMessage(
        fetchedEvent,
        fetchedRSVPs,
        this.config.get('FRONTEND_URL'),
      ),
    );
  }
}
