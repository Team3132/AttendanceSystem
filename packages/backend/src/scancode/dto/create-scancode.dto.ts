import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateScancodeDto {
  @IsString()
  @Length(6)
  @ApiProperty()
  code: string;
}
