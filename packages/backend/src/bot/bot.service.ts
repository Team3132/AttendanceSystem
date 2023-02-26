import { PrismaService } from '@/prisma/prisma.service';
import {
  bold,
  EmbedBuilder,
  ModalActionRowComponentBuilder,
  roleMention,
  time,
} from '@discordjs/builders';
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
  ModalBuilder,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  StringSelectMenuComponentData,
  TextInputBuilder,
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
import rsvpReminderMessage from './utils/rsvpReminderMessage';
import rsvpToDescription from './utils/rsvpToDescription';
import connectOrCreateGuildMember from './utils/connectOrCreateGuildMember';
import attendanceToDescription from './utils/attendanceToDescription';

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
}
