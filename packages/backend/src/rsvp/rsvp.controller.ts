import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { RsvpService } from './rsvp.service';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { UpdateRsvpDto } from './dto/update-rsvp.dto';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SessionGuard } from '@auth/guard/session.guard';
import { GetUser } from '@auth/decorators/GetUserDecorator.decorator';
import { Rsvp } from './entities/rsvp.entity';
import { Roles } from '@auth/decorators/DiscordRoleDecorator.decorator';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { rsvp } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

@ApiTags('RSVP')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('rsvp')
export class RsvpController {
  constructor(
    private readonly rsvpService: RsvpService,
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
  ) {}

  /**
   * Create an RSVP
   * @param createRsvpDto RSVP Create Data
   * @returns {Rsvp}
   */
  @ApiOperation({
    description: 'Create an RSVP',
    operationId: 'createRSVP',
  })
  @Roles(['MENTOR'])
  @ApiCreatedResponse({ type: Rsvp })
  @Post()
  create(
    @Body() createRsvpDto: CreateRsvpDto,
    @GetUser('id') userId: Express.User['id'],
  ) {
    return this.rsvpService.createRSVP({
      id: uuid(),
      eventId: createRsvpDto.eventId,
      userId,
      status: createRsvpDto.status,
    });
  }

  /**
   * Get a specific RSVP
   * @returns {Rsvp}
   */
  @ApiOperation({
    description: 'Get a specific RSVP',
    operationId: 'getRSVP',
  })
  @Roles(['MENTOR'])
  @ApiOkResponse({ type: Rsvp })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const singleRsvp = await this.db.query.rsvp.findFirst({
      where: (rsvp, { eq }) => eq(rsvp.id, id),
    });

    if (!singleRsvp) throw new NotFoundException('RSVP not found');

    return singleRsvp;
  }

  /**
   * Edit a specific RSVP
   * @param updateRsvpDto
   * @returns {Rsvp}
   */
  @ApiOperation({
    description: 'Edit a specific RSVP',
    operationId: 'editRSVP',
  })
  @Roles(['MENTOR'])
  @ApiCreatedResponse({ type: Rsvp })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRsvpDto: UpdateRsvpDto) {
    return this.db
      .update(rsvp)
      .set(updateRsvpDto)
      .where(eq(rsvp.id, id))
      .returning();
  }

  /**
   * Delete an RSVP
   * @returns {Rsvp}
   */
  @ApiOperation({
    description: 'Delete an RSVP',
    operationId: 'deleteRSVP',
  })
  @Roles(['MENTOR'])
  @ApiOkResponse({ type: Rsvp })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.db.delete(rsvp).where(eq(rsvp.id, id));
  }
}
