import { ApiProperty } from '@nestjs/swagger';

export interface LeaderboardDtoType {
  outreachHours: number;
  userId: string;
  username: string;
  rank: number;
}

export class LeaderboardDto {
  @ApiProperty()
  outreachHours: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  rank: number;

  constructor(data: LeaderboardDtoType) {
    Object.assign(this, data);
  }
}
