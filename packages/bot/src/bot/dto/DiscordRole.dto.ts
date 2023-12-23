import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Role } from 'discord.js';

@Exclude()
export class DiscordRole {
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  color: number;

  constructor(role: Role) {
    Object.assign(this, role);
  }
}
