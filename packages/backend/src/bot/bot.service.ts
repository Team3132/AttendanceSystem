import { PrismaService } from '@/prisma/prisma.service';
import { bold, EmbedBuilder, roleMention, time } from '@discordjs/builders';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { Event, RSVP, RSVPStatus } from '@prisma/client';
import {
  ActionRowBuilder,
  BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  PermissionFlagsBits,
} from 'discord.js';
import {
  Button,
  ButtonContext,
  ComponentParam,
  Context,
  ContextOf,
  On,
  Options,
  SlashCommand,
  SlashCommandContext,
} from 'necord';
import { Client } from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { EventAutocompleteInterceptor } from './interceptors/event.interceptor';
import { AttendanceDto } from './dto/attendance.dto';
import { DateTime } from 'luxon';
import { RsvpDto } from './dto/rsvp.dto';
import { RequestRSVPDto } from './dto/requestRSVP.dto';
import { CheckinDto } from './dto/checkin.dto';
import { AuthenticatorService } from '@/authenticator/authenticator.service';

@Injectable()
export class BotService {
  constructor(
    private readonly db: PrismaService,
    private readonly client: Client,
    private readonly config: ConfigService,
    private readonly authenticatorService: AuthenticatorService,
  ) {}

  private readonly logger = new Logger(BotService.name);

  async getGuild() {
    const guildId = this.config.getOrThrow<string>('GUILD_ID');
    const cachedGuild = this.client.guilds.cache.get(guildId);

    if (!cachedGuild || !cachedGuild.available) {
      return this.client.guilds.fetch(guildId);
    } else {
      return cachedGuild;
    }
  }

  private async verifyUserEventToken(
    eventId: string,
    userId: string,
    token: string,
  ) {
    const event = await this.db.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('No event found');

    const isValid = this.authenticatorService.verifyToken(event.secret, token);
    if (!isValid) throw new BadRequestException('Code not valid');

    const rsvp = this.db.rSVP.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      update: {
        attended: true,
      },
      create: {
        attended: true,
        event: {
          connect: {
            id: eventId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return rsvp;
  }

  async getRoles() {
    const guild = await this.getGuild();
    return guild.roles.cache.size ? guild.roles.cache : guild.roles.fetch();
  }

  async getGuildMember(userId: string) {
    const guild = await this.getGuild();
    const guildMember =
      guild.members.cache.get(userId) ?? guild.members.fetch(userId);

    return guildMember;
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }

  @On('error')
  public onError(@Context() [message]: ContextOf<'error'>) {
    this.logger.error(message);
  }

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'checkin',
    description: 'Check in to a meeting using the code on the screen.',
    guilds: [process.env['GUILD_ID']],
  })
  public async onCheckin(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting, code }: CheckinDto,
  ) {
    try {
      await this.verifyUserEventToken(meeting, interaction.user.id, code);
      return interaction.reply({
        ephemeral: true,
        content: 'Checked in!',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return interaction.reply({
          ephemeral: true,
          content: 'Event not found',
        });
      } else if (error instanceof BadRequestException) {
        return interaction.reply({
          ephemeral: true,
          content: 'Code expired',
        });
      } else {
        this.logger.error(error);
        return interaction.reply({
          ephemeral: true,
          content: 'Unknown error, ask the admin to check the logs.',
        });
      }
    }
  }

  @SlashCommand({
    name: 'meetings',
    description: 'Get the next few meetings',
    guilds: [process.env['GUILD_ID']],
  })
  public async onMeetings(@Context() [interaction]: SlashCommandContext) {
    const nextFive = await this.db.event.findMany({
      where: {
        startDate: {
          gte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      take: 5,
    });

    const eventEmbed = (event: Event) =>
      new EmbedBuilder({
        description: event.description,
        title: event.title,
        timestamp: event.startDate.toISOString(),
        url: `${this.config.get('FRONTEND_URL')}/event/${event.id}`,
      });

    const embededEvents = nextFive.map(eventEmbed);

    const noEventEmbed = new EmbedBuilder()
      .setTitle('No upcoming events')
      .setDescription('No upcoming events were found to display.');

    return interaction.reply({
      content: embededEvents
        ? 'Here are the upcoming events'
        : 'No upcoming events',
      embeds: embededEvents ?? [noEventEmbed],
    });
  }

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'rsvps',
    description: 'Get the rsvps for a meeting.',
    guilds: [process.env['GUILD_ID']],
  })
  public async onRSVPs(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting, role }: AttendanceDto,
  ) {
    const fetchedMeeting = await this.db.event.findUnique({
      where: {
        id: meeting,
      },
    });

    if (!fetchedMeeting)
      return interaction.reply({ content: 'Unknown event', ephemeral: true });

    const fetchedRSVPs = await this.db.rSVP.findMany({
      where: {
        eventId: meeting,
        user: {
          roles: {
            has: role?.id,
          },
        },
        status: {
          not: null,
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!fetchedRSVPs.length)
      return interaction.reply({ content: 'No RSVPs', ephemeral: true });

    const description = fetchedRSVPs.map(rsvpToDescription).join(`\n`);

    const rsvpEmbed = new EmbedBuilder()
      .setTitle(
        `RSVPs for ${fetchedMeeting.title} at ${DateTime.fromJSDate(
          fetchedMeeting.startDate,
        ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}`,
      )
      .setDescription(description)
      .setTimestamp(new Date())
      .setURL(`${this.config.get('FRONTEND_URL')}/event/${fetchedMeeting.id}`);

    return interaction.reply({
      embeds: [rsvpEmbed],
    });
  }

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'attendance',
    description: 'Get the attendance for a meeting.',
    guilds: [process.env['GUILD_ID']],
  })
  public async onAttendance(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting, role }: AttendanceDto,
  ) {
    const fetchedMeeting = await this.db.event.findUnique({
      where: {
        id: meeting,
      },
    });

    if (!fetchedMeeting)
      return interaction.reply({ content: 'Unknown event', ephemeral: true });

    const fetchedRSVPs = await this.db.rSVP.findMany({
      where: {
        eventId: meeting,
        user: {
          roles: {
            has: role?.id,
          },
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!fetchedRSVPs.length)
      return interaction.reply({ content: 'No responses', ephemeral: true });

    const description = fetchedRSVPs.map(attendanceToDescription).join(`\n`);

    const attendanceEmbed = new EmbedBuilder()
      .setTitle(
        `Attendance for ${fetchedMeeting.title} at ${DateTime.fromJSDate(
          fetchedMeeting.startDate,
        ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}`,
      )
      .setDescription(description)
      .setTimestamp(new Date())
      .setURL(`${this.config.get('FRONTEND_URL')}/event/${fetchedMeeting.id}`);

    return interaction.reply({
      embeds: [attendanceEmbed],
    });
  }

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

  @Button('event/:eventId/rsvps')
  public async onRsvpsButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
  ) {
    const fetchedMeeting = await this.db.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        RSVP: {
          where: {
            status: {
              not: null,
            },
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

    if (!fetchedMeeting)
      return interaction.reply({ content: 'Unknown event', ephemeral: true });

    if (!fetchedMeeting.RSVP.length)
      return interaction.reply({ content: 'No RSVPs', ephemeral: true });

    const description = fetchedMeeting.RSVP.map(rsvpToDescription).join(`\n`);

    const rsvpEmbed = new EmbedBuilder()
      .setTitle(
        `RSVPs for ${fetchedMeeting.title} at ${DateTime.fromJSDate(
          fetchedMeeting.startDate,
        ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}`,
      )
      .setDescription(description)
      .setTimestamp(new Date())
      .setURL(`${this.config.get('FRONTEND_URL')}/event/${fetchedMeeting.id}`);

    return interaction.reply({
      ephemeral: true,
      embeds: [rsvpEmbed],
    });
  }

  @Button('event/:eventId/rsvp/:rsvpStatus')
  public async onRsvpButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
    @ComponentParam('rsvpStatus') rsvpStatus: RSVPStatus,
  ) {
    const fetchedEvent = await this.db.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!fetchedEvent)
      return interaction.reply({
        ephemeral: true,
        content: "This meeting doesn't exist.",
      });

    const userId = interaction.user.id;

    const user = interaction.member;

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

    const rsvp = await this.db.rSVP.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      create: {
        event: {
          connect: { id: eventId },
        },
        user: {
          connectOrCreate: connectOrCreateGuildMember(user),
        },
        status: rsvpStatus,
      },
      update: {
        event: {
          connect: { id: eventId },
        },
        user: {
          connectOrCreate: connectOrCreateGuildMember(user),
        },
        status: rsvpStatus,
      },
      include: {
        event: {
          include: {
            RSVP: {
              include: {
                user: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const event = rsvp.event;
    const rsvps = event.RSVP;
    const frontendUrl = this.config.getOrThrow('FRONTEND_URL');

    return interaction.update({
      ...rsvpReminderMessage(
        rsvp.event,
        rsvps,
        frontendUrl,
        interaction.guild.roles.everyone.id,
      ),
    });
  }
}

const connectOrCreateGuildMember = (guildMember: GuildMember) => {
  return {
    where: { id: guildMember.id },
    create: {
      id: guildMember.id,
      username: guildMember.nickname ?? guildMember.user.username,
      roles: [...guildMember.roles.cache.mapValues((role) => role.id).values()],
    },
  };
};

const rsvpToDescription = (rsvp: {
  status: RSVPStatus;
  userId: string;
  user: { username?: string };
}) =>
  `${rsvp.user.username ?? ''} - ${
    rsvp.status === 'YES'
      ? `:white_check_mark:`
      : rsvp.status === 'MAYBE'
      ? ':grey_question:'
      : ':x:'
  }`;

const attendanceToDescription = (rsvp: {
  attended: boolean;
  userId: string;
  user: { username?: string };
}) =>
  `${rsvp.user.username ?? ''} - ${bold(
    rsvp.attended ? 'Attended' : 'Not Attended',
  )}`;

// function readableStatus(status: RSVPStatus) {
//   if (status === 'YES') {
//     return 'Coming';
//   } else if (status === 'MAYBE') {
//     return 'Maybe';
//   } else {
//     return 'Not Coming';
//   }
// }

export const rsvpReminderMessage = (
  event: Event,
  rsvp: (RSVP & {
    user: {
      username?: string;
    };
  })[],
  frontendUrl: string,
  everyoneRole: string,
): BaseMessageOptions => {
  const description = rsvp.map(rsvpToDescription).join('\n');

  const meetingEmbed = new EmbedBuilder({
    description: description ?? undefined,
  })
    .setTitle(event.title)
    .addFields(
      {
        name: 'Roles',
        value: event.roles.length
          ? event.roles.map((role) => roleMention(role)).join()
          : roleMention(everyoneRole),
      },
      { name: 'All Day', value: event.allDay ? 'Yes' : 'No' },
      { name: 'Start Time', value: time(event.startDate) },
      { name: 'End Time', value: time(event.endDate) },
    )
    .setURL(`${frontendUrl}/event/${event.id}`);

  const messageComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${RSVPStatus.YES}`)
      .setStyle(ButtonStyle.Success)
      .setLabel('Coming'),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${RSVPStatus.MAYBE}`)
      .setStyle(ButtonStyle.Secondary)
      .setLabel('Maybe'),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${RSVPStatus.NO}`)
      .setStyle(ButtonStyle.Danger)
      .setLabel('Not Coming'),
    // new ButtonBuilder()
    //   .setCustomId(`event/${event.id}/rsvps`)
    //   .setStyle(ButtonStyle.Primary)
    //   .setLabel('RSVPs'),
  );

  return {
    embeds: [meetingEmbed],
    components: [messageComponent],
  };
};
