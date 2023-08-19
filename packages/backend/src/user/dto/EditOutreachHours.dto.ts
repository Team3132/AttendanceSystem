import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class EditOutreachHoursDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  hours: number;

  constructor(editOutreachHours: { hours: number }) {
    Object.assign(this, editOutreachHours);
  }
}
