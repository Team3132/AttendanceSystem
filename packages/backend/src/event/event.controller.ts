import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
  Req,
  Res,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SessionGuard } from '@auth/guard/session.guard';
import { Roles } from '@auth/decorators/DiscordRoleDecorator.decorator';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RsvpService } from '@rsvp/rsvp.service';
import { Rsvp } from '@rsvp/entities/rsvp.entity';
import { GetUser } from '@auth/decorators/GetUserDecorator.decorator';
import { UpdateOrCreateRSVP } from './dto/update-rsvp.dto';
import { ScancodeService } from '@scancode/scancode.service';
import { ScaninDto } from './dto/scanin.dto';
import { GetEventsDto } from './dto/get-events.dto';
import { UpdateRangeRSVP } from './dto/update-rsvp-range';
import { EventResponse, EventResponseType } from './dto/event-response.dto';
import { EventSecret } from './dto/event-secret.dto';
import { ApiResponseTypeNotFound } from '@/standard-error.entity';
import { AuthenticatorService } from '@authenticator/authenticator.service';
import { ConfigService } from '@nestjs/config';
import TokenCheckinDto from './dto/checkin-dto';
import { PrismaService } from '@/prisma/prisma.service';
import { RsvpUser } from './dto/rsvp-user.dto';
import { Request, Response } from 'express';

@ApiTags('Event')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly rsvpService: RsvpService,
    private readonly scancodeService: ScancodeService,
    private readonly authenticatorService: AuthenticatorService,
    private readonly configService: ConfigService,
    private readonly db: PrismaService,
  ) {}

  /**
   * Get all events
   * @returns {Event[]}
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: [EventResponseType] })
  @ApiOperation({ description: 'Get all events', operationId: 'getEvents' })
  @Get()
  async findAll(@Query() eventsGet: GetEventsDto) {
    const { from, to, take } = eventsGet;
    const events = await this.eventService.events({
      take,
      where: {
        AND: [
          {
            OR: [
              {
                startDate: {
                  lte: to,
                },
              },
              {
                endDate: {
                  lte: to,
                },
              },
            ],
          },
          {
            OR: [
              {
                startDate: {
                  gte: from,
                },
              },
              {
                endDate: {
                  gte: from,
                },
              },
            ],
          },
        ],
      },
    });

    return events.map((event) => new EventResponse(event));
  }

  /**
   * Create a new event
   * @param createEventDto The event creation data
   * @returns {Event}
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOperation({
    description: 'Create a new event',
    operationId: 'createEvent',
  })
  @ApiCreatedResponse({ type: EventResponseType })
  @Roles(['MENTOR'])
  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    const event = await this.eventService.createEvent(createEventDto);
    return new EventResponse(event);
  }

  /**
   * Get a specific event
   * @returns {Event}
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOperation({
    description: 'Get a specific event',
    operationId: 'getEvent',
  })
  @ApiNotFoundResponse({ type: ApiResponseTypeNotFound })
  @ApiOkResponse({ type: EventResponseType })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventService.event({ id });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return new EventResponse(event);
  }

  /**
   * Get a specific event secret
   * @returns {EventSecret}
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOperation({
    description: 'Get a specific event secret',
    operationId: 'getEventSecret',
  })
  @Roles(['MENTOR'])
  @ApiOkResponse({ type: EventSecret })
  @ApiNotFoundResponse({ type: ApiResponseTypeNotFound })
  @Get(':eventId/token')
  async getEventSecret(@Param('eventId') eventId: string) {
    const event = await this.eventService.event({ id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return new EventSecret(event);
  }

  /**
   * Callback for the successful token
   */
  @ApiOperation({
    description: 'Callback for a successful token',
    operationId: 'getEventSecretCallback',
  })
  @Get(':eventId/token/callback')
  async eventTokenCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
    @Param('eventId') eventId: string,
    @GetUser('id') userId?: string,
  ) {
    if (!code) throw new BadRequestException('Code is required');
    if (!userId) {
      return res
        .status(302)
        .cookie('redirectTo', req.originalUrl)
        .redirect(`/auth/discord`);
    } else {
      await this.eventService.verifyUserEventToken(eventId, userId, code);

      return res
        .status(302)
        .redirect(
          `${this.configService.getOrThrow('FRONTEND_URL')}/event/${eventId}`,
        );
    }
  }

  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOperation({
    description: 'Callback for a valid code (client input)',
    operationId: 'scanintoEvent',
  })
  @ApiCreatedResponse({ type: Rsvp })
  @Post(':eventId/token/callback')
  async eventTokenPostCallback(
    @Body() body: TokenCheckinDto,
    @Param('eventId') eventId: string,
    @GetUser('id') userId: string,
  ) {
    const { code } = body;
    const rsvp = await this.eventService.verifyUserEventToken(
      eventId,
      userId,
      code,
    );
    return rsvp;
  }

  /**
   * Update an event.
   * @param updateEventDto Event Update Data
   * @returns {EventResponseType}
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOperation({ description: 'Update an event', operationId: 'updateEvent' })
  @ApiOkResponse({ type: EventResponseType })
  @Roles(['MENTOR'])
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const event = await this.eventService.updateEvent({
      data: updateEventDto,
      where: { id },
    });
    return new EventResponse(event);
  }

  /**
   * Delete an event
   * @returns {EventResponseType}
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOperation({ description: 'Delete an event', operationId: 'deleteEvent' })
  @ApiOkResponse({ type: EventResponseType })
  @Roles(['MENTOR'])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const event = await this.eventService.deleteEvent(id);
    return new EventResponse(event);
  }

  /**
   * Get a user's rsvp status for an event.
   * @returns {Rsvp}
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOperation({
    description: "Get a user's rsvp status for an event",
    operationId: 'getEventRsvp',
  })
  @ApiOkResponse({ type: Rsvp })
  @Get(':eventId/rsvp')
  getEventRsvp(
    @Param('eventId') eventId: string,
    @GetUser('id') userId: Express.User['id'],
  ) {
    return this.rsvpService.rsvp({
      eventId_userId: {
        eventId,
        userId,
      },
    });
  }

  /**
   * Set a logged in user's RSVP status for an event.
   * @param setRSVPDto RSVP status
   * @returns {Rsvp}
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOperation({
    description: "Set a logged in user's RSVP status for an event",
    operationId: 'setEventRsvp',
  })
  @ApiCreatedResponse({ type: Rsvp })
  @Post(':eventId/rsvp')
  async setEventRsvp(
    @Param('eventId') eventId: string,
    @GetUser('id') userId: Express.User['id'],
    @Body() { status }: UpdateOrCreateRSVP,
  ) {
    return this.rsvpService.upsertRSVP({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      create: {
        event: {
          connect: { id: eventId },
        },
        user: {
          connect: { id: userId },
        },
        status,
      },
      update: {
        event: {
          connect: { id: eventId },
        },
        user: {
          connect: { id: userId },
        },
        status,
      },
    });
  }

  /**
   * Update RSVP Status of Events in range
   * @returns {Rsvp[]}
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOperation({
    description: 'Update RSVP Status of Events in range',
    operationId: 'updateEventRsvpRange',
  })
  @ApiCreatedResponse({ type: [Rsvp] })
  @Post('rsvps')
  async setEventsRsvp(
    @Body() updateRangeRSVP: UpdateRangeRSVP,
    @GetUser('id') userId: Express.User['id'],
  ) {
    const { from, to, status } = updateRangeRSVP;
    const events = await this.eventService.events({
      where: {
        AND: [
          {
            OR: [
              {
                startDate: {
                  lte: to,
                },
              },
              {
                endDate: {
                  lte: to,
                },
              },
            ],
          },
          {
            OR: [
              {
                startDate: {
                  gte: from,
                },
              },
              {
                endDate: {
                  gte: from,
                },
              },
            ],
          },
        ],
      },
    });
    return this.rsvpService.upsertManyRSVP(
      userId,
      events.map((event) => event.id),
      status,
    );
  }

  /**
   * Get an event's asociated RSVPs
   * @returns {Rsvp[]}
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOperation({
    description: "Get an event's asociated RSVPs",
    operationId: 'getEventRsvps',
  })
  @ApiOkResponse({ type: [RsvpUser] })
  @Get(':eventId/rsvps')
  getEventRsvps(@Param('eventId') eventId: string) {
    return this.db.rSVP.findMany({
      where: {
        eventId,
      },
      include: {
        user: {
          select: {
            username: true,
            id: true,
            roles: true,
          },
        },
      },
    });
  }

  /**
   * RSVP to an event by using a scancode
   * @param eventId The event id
   * @param scanin The scanin data (code)
   * @returns {Rsvp}
   */
  @ApiCookieAuth()
  @UseGuards(SessionGuard)
  @ApiOperation({
    description: 'RSVP to an event by using a scancode',
    operationId: 'scaninEvent',
  })
  @ApiCreatedResponse({ type: Rsvp })
  @ApiBadRequestResponse({ description: 'Invalid Scancode' })
  @Post(':eventId/scanin')
  scanin(@Param('eventId') eventId: string, @Body() scanin: ScaninDto) {
    const { code } = scanin;
    return this.rsvpService.scanin({ eventId, code });
  }
}
