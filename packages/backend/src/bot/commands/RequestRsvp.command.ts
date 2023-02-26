import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PermissionFlagsBits } from 'discord.js';
import { SlashCommand, Context, SlashCommandContext, Options } from 'necord';
import { RequestRSVPDto } from '../dto/requestRSVP.dto';
import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';
import rsvpReminderMessage from '../utils/rsvpReminderMessage';

@Injectable()
export class RequestRsvpCommand {
  constructor(
    private readonly db: PrismaService,
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
    const event = await this.db.event.findUnique({
      where: {
        id: meeting,
      },
      include: {
        RSVP: {
          orderBy: {
            updatedAt: 'asc',
          },
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    if (!event)
      return interaction.reply({
        ephemeral: true,
        content: 'No meeting with that Id',
      });

    return interaction.reply(
      rsvpReminderMessage(
        event,
        event.RSVP,
        this.config.get('FRONTEND_URL'),
        interaction.guild.roles.everyone.id,
      ),
    );
  }
}
