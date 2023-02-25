import { District_List } from '@/../tbaApi';
import { ApiProperty } from '@nestjs/swagger';

export class DistrictListDto implements District_List {
  @ApiProperty()
  abbreviation: string;
  @ApiProperty()
  display_name: string;
  @ApiProperty()
  key: string;
  @ApiProperty()
  year: number;
}
