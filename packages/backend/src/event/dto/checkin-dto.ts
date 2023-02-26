import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class TokenCheckinDto {
  @ApiProperty()
  @IsString()
  code: string;
}
