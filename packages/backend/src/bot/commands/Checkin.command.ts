import { AuthenticatorService } from '@/authenticator/authenticator.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SlashCommand, Context, SlashCommandContext, Options } from 'necord';
import { CheckinDto } from '../dto/checkin.dto';
import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';
import { DRIZZLE_TOKEN, DrizzleDatabase } from '@/drizzle/drizzle.module';
import { rsvp } from '../../../drizzle/schema';

@Injectable()
export class CheckinCommand {
  private readonly logger = new Logger(CheckinCommand.name);

  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
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
    const fetchedEvent = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });
    if (!fetchedEvent) throw new NotFoundException('No event found');

    const isValid = this.authenticator.verifyToken(fetchedEvent.secret, token);
    if (!isValid) throw new BadRequestException('Code not valid');

    // const rsvp = this.db.rSVP.upsert({
    //   where: {
    //     eventId_userId: {
    //       eventId,
    //       userId,
    //     },
    //   },
    //   update: {
    //     attended: true,
    //   },
    //   create: {
    //     attended: true,
    //     event: {
    //       connect: {
    //         id: eventId,
    //       },
    //     },
    //     user: {
    //       connect: {
    //         id: userId,
    //       },
    //     },
    //   },
    // });

    const newRSVP = await this.db
      .insert(rsvp)
      .values({
        eventId,
        attended: true,
        userId,
      })
      .onConflictDoUpdate({
        set: {
          attended: true,
        },
        target: [rsvp.eventId, rsvp.userId],
      });

    return newRSVP;
  }
}
