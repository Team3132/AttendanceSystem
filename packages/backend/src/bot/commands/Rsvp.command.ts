import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { GuildMember, EmbedBuilder } from 'discord.js';
import { SlashCommand, Context, SlashCommandContext, Options } from 'necord';
import { RsvpDto } from '../dto/rsvp.dto';
import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';
import connectOrCreateGuildMember from '../utils/connectOrCreateGuildMember';
import rsvpToDescription from '../utils/rsvpToDescription';

@Injectable()
export class RsvpCommand {
  constructor(private readonly db: PrismaService) {}

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'rsvp',
    description: 'RSVP to an event',
    guilds: [process.env['GUILD_ID']],
  })
  public async onRSVP(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting, status }: RsvpDto,
  ) {
    const fetchedEvent = await this.db.event.findUnique({
      where: {
        id: meeting,
      },
    });

    if (!fetchedEvent)
      return interaction.reply({
        ephemeral: true,
        content: "This meeting doesn't exist.",
      });

    const user = interaction.member;

    if (!(user instanceof GuildMember)) {
      return interaction.reply('Not a guild member');
    }

    if (!(user instanceof GuildMember)) {
      return interaction.reply('Not a guild member');
    }

    const roles = fetchedEvent.roles.length
      ? fetchedEvent.roles
      : [interaction.guild.roles.everyone.id];

    if (!user.roles.cache.some((role) => roles.includes(role.id)))
      return interaction.reply({
        ephemeral: true,
        content: "You don't have permission to reply to this event",
      });

    const userId = user.id;

    const rsvp = await this.db.rSVP.upsert({
      where: {
        eventId_userId: {
          eventId: meeting,
          userId,
        },
      },
      create: {
        event: {
          connect: { id: meeting },
        },
        user: {
          connectOrCreate: connectOrCreateGuildMember(user),
        },
        status,
      },
      update: {
        event: {
          connect: { id: meeting },
        },
        user: {
          connectOrCreate: connectOrCreateGuildMember(user),
        },
        status,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const embed = new EmbedBuilder()
      .setDescription(rsvpToDescription(rsvp))
      .setTitle('Successfully Updated')
      .setColor([0, 255, 0]);
    // interaction.channel.send()
    return interaction.reply({
      ephemeral: true,
      embeds: [embed],
    });
  }
}
