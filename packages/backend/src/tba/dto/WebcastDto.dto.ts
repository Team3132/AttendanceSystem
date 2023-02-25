import { Webcast } from '@/../tbaApi';
import { ApiProperty } from '@nestjs/swagger';

export class WebcastDto implements Webcast {
  @ApiProperty({ enum: Webcast.type })
  type: Webcast.type;
  @ApiProperty()
  channel: string;
  @ApiProperty()
  date?: string;
  @ApiProperty()
  file?: string;
}
