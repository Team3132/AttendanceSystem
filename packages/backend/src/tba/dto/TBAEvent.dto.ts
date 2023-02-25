import { District_List, Event, Webcast } from '@/../tbaApi';
import { ApiProperty } from '@nestjs/swagger';
import { DistrictListDto } from './DistrictList.dto';
import { WebcastDto } from './WebcastDto.dto';

export class TBAEventDto implements Event {
  @ApiProperty()
  key: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  event_code: string;
  @ApiProperty()
  event_type: number;
  @ApiProperty()
  district?: DistrictListDto;
  @ApiProperty()
  city?: string;
  @ApiProperty()
  state_prov?: string;
  @ApiProperty()
  country?: string;
  @ApiProperty()
  start_date: string;
  @ApiProperty()
  end_date: string;
  @ApiProperty()
  year: number;
  @ApiProperty()
  short_name?: string;
  @ApiProperty()
  event_type_string: string;
  @ApiProperty()
  week?: number;
  @ApiProperty()
  address?: string;
  @ApiProperty()
  postal_code?: string;
  @ApiProperty()
  gmaps_place_id?: string;
  @ApiProperty()
  gmaps_url?: string;
  @ApiProperty()
  lat?: number;
  @ApiProperty()
  lng?: number;
  @ApiProperty()
  location_name?: string;
  @ApiProperty()
  timezone?: string;
  @ApiProperty()
  website?: string;
  @ApiProperty()
  first_event_id?: string;
  @ApiProperty()
  first_event_code?: string;
  @ApiProperty()
  webcasts?: WebcastDto[];
  @ApiProperty()
  division_keys?: string[];
  @ApiProperty()
  parent_event_key?: string;
  @ApiProperty()
  playoff_type?: number;
  @ApiProperty()
  playoff_type_string?: string;
}
