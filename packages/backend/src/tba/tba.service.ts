import { Event, TBAApi } from '@/../tbaApi';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TbaService {
  private readonly tbaClient: TBAApi;

  constructor(private readonly configService: ConfigService) {
    this.tbaClient = new TBAApi({
      HEADERS: {
        'X-TBA-Auth-Key': configService.getOrThrow('TBA_TOKEN'),
      },
    });
  }

  /**
   * Get the next event for the team
   * @returns The next event or undefined
   */
  public async getNextEvent(): Promise<undefined | Event> {
    const currentYear = new Date().getFullYear();
    const nextEvent = await this.tbaClient.team.getTeamEventsByYear(
      'frc3132',
      currentYear,
    );
    return nextEvent.find((event) => {
      const initialDate = new Date();
      // parse Date from format yyyy-mm-dd using luxon
      const eventDate = new Date(event.start_date);

      return eventDate > initialDate;
    });
  }
}
