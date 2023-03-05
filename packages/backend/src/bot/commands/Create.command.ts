import { AuthenticatorService } from '@/authenticator/authenticator.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbedBuilder, hideLinkEmbed, PermissionFlagsBits } from 'discord.js';
import { SlashCommand, Context, SlashCommandContext, Options } from 'necord';
import { URLSearchParams } from 'url';
import { CreateDto } from '../dto/create.dto';
import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';

@Injectable()
export class CreateCommand {
  private readonly logger = new Logger(CreateCommand.name);

  constructor(
    private readonly db: PrismaService,
    private readonly config: ConfigService,
    private readonly authenticator: AuthenticatorService,
  ) {}

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'create',
    description: 'Create a new event on the spot.',
    guilds: [process.env['GUILD_ID']],
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
  })
  public async onCreate(
    @Context() [interaction]: SlashCommandContext,
    @Options() { eventName, eventType, role, allday, description }: CreateDto,
  ) {
    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL');

    const startDate = interaction.createdAt.toISOString();

    const endDate = new Date(startDate);

    endDate.setHours(interaction.createdAt.getHours() + 3);

    const endDateIso = endDate.toISOString();

    const params = new URLSearchParams();

    params.append('startDate', startDate);
    params.append('endDay', endDateIso);

    if (allday) {
      params.append('allDay', allday.toString());
    }

    if (eventType) {
      params.append('eventType', eventType);
    }

    if (eventName) {
      params.append('eventName', eventName);
    }

    if (role) {
      params.append('role', role.id);
    }

    if (description) {
      params.append('description', description);
    }

    const createUrl = `${frontendUrl}/event/create?${params.toString()}`;

    const successEmbed = new EmbedBuilder()
      .setTitle('Success')
      .setColor('Default').setDescription(`
        ${hideLinkEmbed(createUrl)}
      `);

    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
  }
}
