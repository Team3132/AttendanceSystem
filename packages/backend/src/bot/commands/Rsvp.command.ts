import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { GuildMember, EmbedBuilder } from 'discord.js';
import { SlashCommand, Context, SlashCommandContext, Options } from 'necord';
import { RsvpDto } from '../dto/rsvp.dto';
import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';
import rsvpToDescription from '../utils/rsvpToDescription';
import { DRIZZLE_TOKEN, DrizzleDatabase } from '@/drizzle/drizzle.module';
import { rsvp } from '../../../drizzle/schema';

@Injectable()
export class RsvpCommand {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase) {}

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
    const fetchedEvent = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, meeting),
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

    // const rsvp = await this.db.rSVP.upsert({
    //   where: {
    //     eventId_userId: {
    //       eventId: meeting,
    //       userId,
    //     },
    //   },
    //   create: {
    //     event: {
    //       connect: { id: meeting },
    //     },
    //     user: {
    //       connectOrCreate: connectOrCreateGuildMember(user),
    //     },
    //     status,
    //   },
    //   update: {
    //     event: {
    //       connect: { id: meeting },
    //     },
    //     user: {
    //       connectOrCreate: connectOrCreateGuildMember(user),
    //     },
    //     status,
    //   },
    //   include: {
    //     user: {
    //       select: {
    //         username: true,
    //       },
    //     },
    //   },
    // });

    await this.db
      .insert(rsvp)
      .values({
        eventId: meeting,
        userId,
        status,
      })
      .onConflictDoUpdate({
        target: [rsvp.eventId, rsvp.userId],
        set: {
          status,
        },
      })
      .returning();

    const newRSVP = await this.db.query.rsvp.findFirst({
      where: (rsvp, { eq }) => eq(rsvp.eventId, meeting),
      with: {
        user: {
          columns: {
            username: true,
          },
        },
      },
    });

    const embed = new EmbedBuilder()
      .setDescription(rsvpToDescription(newRSVP))
      .setTitle('Successfully Updated')
      .setColor([0, 255, 0]);
    // interaction.channel.send()
    return interaction.reply({
      ephemeral: true,
      embeds: [embed],
    });
  }
}
