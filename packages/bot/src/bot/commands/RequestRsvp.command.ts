import { Inject, Injectable, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PermissionFlagsBits } from 'discord.js';
import {
  SlashCommand,
  Context,
  type SlashCommandContext,
  Options,
} from 'necord';
import { RequestRSVPDto } from '../dto/requestRSVP.dto';
import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';
import rsvpReminderMessage from '../utils/rsvpReminderMessage';
import { BACKEND_TOKEN, type BackendClient } from '@/backend/backend.module';
import { GuildMemberGuard } from '../guards/GuildMemberGuard';

const guildId = process.env['GUILD_ID'];

@Injectable()
export class RequestRsvpCommand {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(GuildMemberGuard)
  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'requestrsvp',
    description: 'Send a message for people to RSVP to a specific event.',
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
    guilds: guildId ? [guildId] : undefined,
    dmPermission: false,
  })
  public async onRequestRSVP(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting }: RequestRSVPDto,
  ) {
    const eventDetails =
      await this.backendClient.client.bot.getEventDetails.query(meeting);

    if (!eventDetails)
      return interaction.reply({
        ephemeral: true,
        content: 'No meeting with that Id',
      });

    const fetchedRSVPs =
      await this.backendClient.client.bot.getEventRsvps.query(meeting);

    return interaction.reply(
      rsvpReminderMessage(
        eventDetails,
        fetchedRSVPs,
        this.config.getOrThrow('FRONTEND_URL'),
      ),
    );
  }
}
