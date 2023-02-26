import { Injectable } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

@Injectable()
export class GcalService {
  constructor(private readonly config: ConfigService) {}

  async events() {
    const googleClientEmail = this.config.getOrThrow<string>(
      'GOOGLE_CLIENT_EMAIL',
    );
    const googlePrivateKey =
      this.config.getOrThrow<string>('GOOGLE_PRIVATE_KEY');

    const calendarId = this.config.getOrThrow<string>('GOOGLE_CALENDAR_ID');

    const client = new google.auth.JWT(
      googleClientEmail,
      null,
      googlePrivateKey,
      SCOPES,
    );

    const calendar = google.calendar({
      version: 'v3',
      auth: client,
    });

    return new Promise<calendar_v3.Schema$Events>((res, rej) => {
      calendar.events.list(
        {
          calendarId,
          timeMin: DateTime.now().toISO(),
          timeMax: DateTime.now().plus({ month: 1 }).toISO(),
          orderBy: 'startTime',
          singleEvents: true,
        },
        (error, result) => {
          if (error) {
            rej(error);
          }
          res(result.data);
        },
      );
    });
  }
}
