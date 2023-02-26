import { AuthenticatorService } from '@/authenticator/authenticator.service';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SlashCommand, Context, SlashCommandContext, Options } from 'necord';
import { CheckinDto } from '../dto/checkin.dto';
import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';

@Injectable()
export class CheckinCommand {
  private readonly logger = new Logger(CheckinCommand.name);

  constructor(
    private readonly db: PrismaService,
    private readonly config: ConfigService,
    private readonly authenticator: AuthenticatorService,
  ) {}

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

  private async verifyUserEventToken(
    eventId: string,
    userId: string,
    token: string,
  ) {
    const event = await this.db.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('No event found');

    const isValid = this.authenticator.verifyToken(event.secret, token);
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
}
