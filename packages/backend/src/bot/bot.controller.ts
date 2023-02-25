import { SessionGuard } from '@auth/guard/session.guard';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Client } from 'discord.js';
import { BotService } from './bot.service';
import { DiscordRole } from './dto/DiscordRole.dto';

@Controller('bot')
@UseGuards(SessionGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Bot')
export class BotController {
  constructor(
    private readonly client: Client,
    private readonly botService: BotService,
  ) {}

  @ApiOperation({
    description: 'Get the status of the bot',
    operationId: 'getStatus',
  })
  @ApiOkResponse({ type: Boolean })
  @Get('status')
  getStatus() {
    return this.client.isReady();
  }

  @ApiOperation({
    description: 'Get the roles in the guild',
    operationId: 'getRoles',
  })
  @ApiOkResponse({ type: [DiscordRole] })
  @Get('roles')
  async getRoles() {
    const roles = await this.botService.getRoles();
    const formattedRoles = roles.map((role) => new DiscordRole(role));
    return formattedRoles;
  }
}
