import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Session,
  ForbiddenException,
  Inject,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SessionGuard } from '@auth/guard/session.guard';
import { GetUser } from '@auth/decorators/GetUserDecorator.decorator';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@auth/decorators/DiscordRoleDecorator.decorator';
import { User } from './entities/user.entity';
import { Rsvp } from '@rsvp/entities/rsvp.entity';
import { Scancode } from '@scancode/entities/scancode.entity';
import { ScancodeService } from '@scancode/scancode.service';
import { CreateScancodeDto } from '@scancode/dto/create-scancode.dto';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { user } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { RsvpEvent } from '@/rsvp/dto/event-rsvp.dto';
import { EditOutreachHoursDto } from './dto/EditOutreachHours.dto';

/** The user controller for controlling the user status */
@ApiTags('User')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly scancodeService: ScancodeService,
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
  ) {}

  /**
   * Get the currently authenticated user.
   * @returns {User}
   */
  @ApiOperation({
    description: 'Get the currently authenticated user.',
    operationId: 'getMe',
  })
  @ApiOkResponse({ type: User })
  @Get('me')
  async me(@GetUser('id') id: Express.User['id']) {
    const currentUser = await this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });
    return currentUser;
  }

  /**
   * Get a specific user.
   * @param userId The actionable user.
   * @returns {User}
   */
  @ApiOperation({
    description: 'Get a specific user.',
    operationId: 'getUser',
  })
  @ApiOkResponse({ type: User })
  @Roles(['MENTOR'])
  @Get(':id')
  async user(@Param('id') userId: string) {
    const selectedUser = await this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });
    return selectedUser;
  }

  /**
   * Get the currently authenticated user's avatar id
   * @returns {string}
   */
  @ApiOperation({
    description: "Get the currently authenticated user's avatar id",
    operationId: 'getMeAvatar',
  })
  @ApiOkResponse({ type: String })
  @Get('me/avatar')
  async userMeAvatar(@GetUser('id') userId: Express.User['id']) {
    const { user } = await this.userService.discordProfile(userId);
    return user.avatar;
  }

  /**
   * Get a user's discord avatar id
   * @returns {string}
   */
  @ApiOperation({
    description: "Get a user's discord avatar id",
    operationId: 'getUserAvatar',
  })
  @ApiOkResponse({ type: String })
  @Roles(['MENTOR'])
  @Get(':id/avatar')
  async userAvatar(@Param('id') userId: string) {
    const { user } = await this.userService.discordProfile(userId);
    return user.avatar;
  }

  /**
   * Get the RSVPs of the logged in user.
   * @returns {Rsvp[]}
   */
  @ApiOperation({
    description: 'Get the RSVPs of the logged in user.',
    operationId: 'getMeRSVPs',
  })
  @ApiOkResponse({ type: [Rsvp] })
  @Get('me/rsvp')
  async meRSVP(@GetUser('id') id: Express.User['id']) {
    const myRsvps = await this.db.query.rsvp.findMany({
      where: (rsvp, { eq }) => eq(rsvp.userId, id),
    });

    return myRsvps;
  }

  /**
   * Get a user's RSVPs
   * @returns {Rsvp[]}
   */
  @ApiOperation({
    description: "Get a user's RSVPs",
    operationId: 'getUserRSVPs',
  })
  @ApiOkResponse({ type: [Rsvp] })
  @Roles(['MENTOR'])
  @Get(':id/rsvp')
  async userRSVPs(@Param('id') userId: string) {
    const targetUserRsvps = await this.db.query.rsvp.findMany({
      where: (rsvp, { eq }) => eq(rsvp.userId, userId),
    });

    return targetUserRsvps;
  }

  /**
   * Edit the signed-in user.
   * @param updateUserDto
   * @returns {User}
   */
  @ApiOperation({
    description: 'Edit the signed-in user.',
    operationId: 'editMe',
  })
  @ApiCreatedResponse({ type: User })
  @Patch('me')
  async update(
    @GetUser('id') id: Express.User['id'],
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.db
      .update(user)
      .set(updateUserDto)
      .where(eq(user.id, id))
      .returning();

    const supposedlyUpdatedUser = updatedUser.at(0);

    if (!supposedlyUpdatedUser) throw new NotFoundException('User not found');

    return supposedlyUpdatedUser;
  }

  /**
   * Edit a user.
   * @param updateUserDto New user info.
   * @returns {User}
   */
  @ApiOperation({
    description: 'Edit a user.',
    operationId: 'editUser',
  })
  @ApiCreatedResponse({ type: User })
  @Roles(['MENTOR'])
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.db
      .update(user)
      .set(updateUserDto)
      .where(eq(user.id, id))
      .returning();

    const supposedlyUpdatedUser = updatedUser.at(0);

    if (!supposedlyUpdatedUser) throw new NotFoundException('User not found');

    return supposedlyUpdatedUser;
  }

  /**
   * Delete the signed in user.
   * @returns {User}
   */
  @ApiOperation({
    description: 'Delete the signed in user.',
    operationId: 'deleteMe',
  })
  @ApiOkResponse({ type: User })
  @Delete('me')
  async remove(
    @GetUser('id') id: Express.User['id'],
    @Session() session: Express.Request['session'],
  ) {
    const destroySession = new Promise<void>((res, rej) => {
      session.destroy((callback) => {
        if (callback) {
          rej(callback);
        } else {
          res();
        }
      });
    });

    await destroySession;

    return this.userService.deleteUser(id);
  }

  /**
   * Delete a user.
   * @returns {User}
   */
  @ApiOperation({
    description: 'Delete a user.',
    operationId: 'deleteUser',
  })
  @ApiOkResponse({ type: User })
  @Roles(['MENTOR'])
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  /**
   * Get a list of all users.
   * @returns {User[]}
   */
  @ApiOperation({
    description: 'Get a list of all users.',
    operationId: 'getUsers',
  })
  @ApiOkResponse({ type: [User] })
  @Roles(['MENTOR'])
  @Get()
  async users() {
    const allUsersList = await this.db.select().from(user);
    return allUsersList;
  }

  /**
   * Get a list of the logged in user's scancodes.
   * @returns {Scancode[]}
   */
  @ApiOperation({
    description: "Get a list of the logged in user's scancodes.",
    operationId: 'getMeScancodes',
  })
  @ApiOkResponse({ type: [Scancode] })
  @Get('me/scancodes')
  async scancodes(@GetUser('id') id: Express.User['id']) {
    const myScancodes = await this.db.query.scancode.findMany({
      where: (scancode, { eq }) => eq(scancode.userId, id),
    });

    return myScancodes;
  }

  /**
   * Get a list of the specified user's scancodes.
   * @returns {Scancode[]}
   */
  @ApiOperation({
    description: "Get a list of the specified user's scancodes.",
    operationId: 'getUserScancodes',
  })
  @ApiOkResponse({ type: [Scancode] })
  @Roles(['MENTOR'])
  @Get(':id/scancodes')
  async userScancodes(@Param('id') id: string) {
    const targetUserScancodes = await this.db.query.scancode.findMany({
      where: (scancode, { eq }) => eq(scancode.userId, id),
    });

    return targetUserScancodes;
  }

  /**
   * Create a scancode for the logged in user.
   * @returns  {Scancode}
   */
  @ApiOperation({
    description: 'Create a scancode for the logged in user.',
    operationId: 'createMeScancode',
  })
  @ApiCreatedResponse({ type: Scancode })
  @Post('me/scancodes')
  async createScancode(
    @GetUser('id') userId: Express.User['id'],
    @Body() body: CreateScancodeDto,
  ) {
    return this.scancodeService.createScancode({
      ...body,
      userId,
    });
  }

  /**
   * Create a scancode for the specified user.
   * @returns {Scancode}
   */
  @ApiOperation({
    description: 'Create a scancode for the specified user.',
    operationId: 'createUserScancode',
  })
  @ApiCreatedResponse({ type: Scancode })
  @Roles(['MENTOR'])
  @Post(':id/scancodes')
  async createUserScancode(
    @Param('id') userId: string,
    @Body() body: CreateScancodeDto,
  ) {
    return this.scancodeService.createScancode({
      ...body,
      userId,
    });
  }

  /**
   * Delete a scancode for the logged in user.
   * @returns {Scancode}
   */
  @ApiOperation({
    description: 'Delete a scancode for the logged in user.',
    operationId: 'deleteMeScancode',
  })
  @ApiOkResponse({ type: Scancode })
  @Delete('me/scancodes/:scancodeId')
  async deleteScancode(
    @GetUser('id') userId: Express.User['id'],
    @Param('scancodeId') scancodeId: string,
  ) {
    const scancode = await this.db.query.scancode.findFirst({
      where: (scancode, { eq }) => eq(scancode.code, scancodeId),
    });

    if (scancode.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.scancodeService.deleteScancode(scancodeId);
  }

  /**
   * Delete a scancode for the specified user.
   * @returns {Scancode}
   */
  @ApiOperation({
    description: 'Delete a scancode for the specified user.',
    operationId: 'deleteUserScancode',
  })
  @ApiOkResponse({ type: Scancode })
  @Roles(['MENTOR'])
  @Delete(':id/scancodes/:scancodeId')
  async deleteUserScancode(
    @Param('id') userId: string,
    @Param('scancodeId') scancodeId: string,
  ) {
    const scancode = await this.db.query.scancode.findFirst({
      where: (scancode, { eq }) => eq(scancode.code, scancodeId),
    });

    if (scancode.userId !== userId) {
      throw new ForbiddenException();
    }

    const deletedScancode =
      await this.scancodeService.deleteScancode(scancodeId);

    return deletedScancode;
  }

  @ApiOperation({
    description: 'Get the currently pending RSVPs of the logged in user.',
    operationId: 'getMePendingRSVPs',
  })
  @ApiOkResponse({ type: [RsvpEvent] })
  @Get('me/rsvp/pending')
  async mePendingRSVP(@GetUser('id') id: Express.User['id']) {
    const pendingRsvps = await this.userService.activeRsvps(id);

    return pendingRsvps.map((rsvp) => new RsvpEvent(rsvp.RSVP, rsvp.Event));
  }

  @ApiOperation({
    description: 'Get the currently pending RSVPs of the specified user.',
    operationId: 'getUserPendingRSVPs',
  })
  @ApiOkResponse({ type: [RsvpEvent] })
  @Roles(['MENTOR'])
  @Get(':id/rsvp/pending')
  async userPendingRSVPs(@Param('id') userId: string) {
    const pendingRsvps = await this.userService.activeRsvps(userId);

    return pendingRsvps.map((rsvp) => new RsvpEvent(rsvp.RSVP, rsvp.Event));
  }

  @ApiOperation({
    description: 'Get the additional outreach hours of the specified user.',
    operationId: 'getUserAdditionalOutreachHours',
  })
  @ApiOkResponse({ type: EditOutreachHoursDto })
  @Roles(['MENTOR'])
  @Get(':id/extra-outreach-hours')
  async userAdditionalOutreachHours(@Param('id') userId: string) {
    const outreachHours = await this.userService.getAdditionalOutreach(userId);

    if (outreachHours === undefined || outreachHours === null)
      throw new NotFoundException(
        `No additional outreach hours found for user with id ${userId}`,
      );

    return new EditOutreachHoursDto({
      hours: outreachHours,
    });
  }

  @ApiOperation({
    description: "Edit the outreach hours of the specified user's.",
    operationId: 'editUserOutreachHours',
  })
  @ApiOkResponse({ type: EditOutreachHoursDto })
  @Roles(['MENTOR'])
  @Patch(':id/extra-outreach-hours')
  async editUserOutreachHours(
    @Param('id') userId: string,
    @Body() body: EditOutreachHoursDto,
  ) {
    const outreachHours = await this.userService.editAdditionalOutreach(
      userId,
      body.hours,
    );

    if (!outreachHours)
      throw new NotFoundException(
        `No additional outreach hours found for user with id ${userId}`,
      );

    return new EditOutreachHoursDto({
      hours: outreachHours.additionalOutreachHours,
    });
  }
}
