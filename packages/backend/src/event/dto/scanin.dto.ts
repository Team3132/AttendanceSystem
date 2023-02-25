import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ScaninDto {
  @IsString()
  @ApiProperty()
  code: string;
}
