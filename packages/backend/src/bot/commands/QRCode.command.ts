import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { SlashCommand, Context, SlashCommandContext, Options } from 'necord';

import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';
import { EventService } from '@/event/event.service';
import QRCode from 'qrcode';
import { QrCodeDto } from '../dto/qrcode.dto';
import { ConfigService } from '@nestjs/config';
import { createCanvas } from 'canvas';
import { AttachmentBuilder, EmbedBuilder, spoiler } from 'discord.js';

@Injectable()
export class QRCodeCommand {
  constructor(
    private readonly eventService: EventService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(QRCodeCommand.name);

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'qrcode',
    description: 'Get the QR code for an event',
    guilds: [process.env['GUILD_ID']],
    defaultMemberPermissions: 'ManageMessages',
  })
  public async onLeaderboard(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting, publish = false }: QrCodeDto,
  ) {
    const eventSecret = await this.eventService.getEventSecret(meeting);
    const frontendUrl = this.configService.getOrThrow('FRONTEND_URL');
    const url = `${frontendUrl}/api/event/${meeting}/token/callback?code=${eventSecret}`;

    const canvas = createCanvas(200, 200);
    await QRCode.toCanvas(canvas, url);

    const attachment = new AttachmentBuilder(await canvas.toBuffer(), {
      name: 'qrcode.png',
    });

    const embed = new EmbedBuilder()
      .setTitle('Checkin QR Code')
      .setDescription('Scan this QR code to checkin to the event')
      .setFields({ name: 'Secret', value: spoiler(eventSecret) })
      .setImage(`attachment://${attachment.name}`);

    return interaction.reply({
      ephemeral: !publish,
      content: 'Here is the checkin QR code for this event',
      embeds: [embed],
      files: [attachment],
    });
  }
}
