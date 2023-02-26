import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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

@ApiTags('RSVP')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

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
      event: {
        connect: { id: createRsvpDto.eventId },
      },
      user: {
        connect: { id: userId },
      },
      status: createRsvpDto.status,
    });
  }

  /**
   * Get all RSVPs
   * @returns {Rsvp[]}
   */
  @ApiOperation({
    description: 'Get all RSVPs',
    operationId: 'getRSVPs',
  })
  @Roles(['MENTOR'])
  @ApiOkResponse({ type: [Rsvp] })
  @Get()
  findAll() {
    return this.rsvpService.rsvps({ where: {} });
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
  findOne(@Param('id') id: string) {
    return this.rsvpService.rsvp({ id });
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
    return this.rsvpService.updateRSVP({ where: { id }, data: updateRsvpDto });
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
    return this.rsvpService.deleteRSVP({ id });
  }
}
