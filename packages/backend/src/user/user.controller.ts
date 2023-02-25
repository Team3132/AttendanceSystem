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
  BadRequestException,
  Query,
  ForbiddenException,
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
import { RsvpService } from '@rsvp/rsvp.service';
import { Rsvp } from '@rsvp/entities/rsvp.entity';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/index.js';
import { OutreachReport } from './dto/outreach-report.dto';
import { GetOutreachReport } from './dto/outreach-report-get.dto';
import { Scancode } from '@scancode/entities/scancode.entity';
import { ScancodeService } from '@scancode/scancode.service';
import { CreateScancodeDto } from '@scancode/dto/create-scancode.dto';

/** The user controller for controlling the user status */
@ApiTags('User')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rsvpService: RsvpService,
    private readonly scancodeService: ScancodeService,
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
  me(@GetUser('id') id: Express.User['id']) {
    return this.userService.user({ id });
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
  user(@Param('id') userId: string) {
    return this.userService.user({ id: userId });
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
  meRSVP(@GetUser('id') id: Express.User['id']) {
    return this.rsvpService.rsvps({ where: { userId: id } });
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
  userRSVPs(@Param('id') userId: string) {
    return this.rsvpService.rsvps({
      where: {
        userId: userId,
      },
    });
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
  update(
    @GetUser('id') id: Express.User['id'],
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return this.userService.updateUser({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('The email must be unique');
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
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
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.userService.updateUser({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('The email must be unique');
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * Regenerates the calendar token of the signed in user.
   * @returns {User}
   */
  @ApiOperation({
    description: 'Regenerates the calendar token of the signed in user.',
    operationId: 'regenerateMeCalendarToken',
  })
  @ApiCreatedResponse({ type: User })
  @Post('me/regenerateToken')
  regenerateToken(@GetUser('id') id: Express.User['id']) {
    return this.userService.regenerateCalendarSecret({ id });
  }

  /**
   * Regenerates the calendar token of the specified user.
   * @returns {User}
   */
  @ApiOperation({
    description: 'Regenerates the calendar token of the specified user.',
    operationId: 'regenerateUserCalendarToken',
  })
  @ApiCreatedResponse({ type: User })
  @Roles(['MENTOR'])
  @Post(':id/regenerateToken')
  regenerateUserToken(@Param('id') id: string) {
    return this.userService.regenerateCalendarSecret({ id });
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

    return this.userService.deleteUser({ id });
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
    return this.userService.deleteUser({ id });
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
  users() {
    return this.userService.users({});
  }

  /**
   * Get an outreach report of the logged in user.
   * @returns {OutreachReport}
   */
  @ApiOperation({
    description: 'Get an outreach report of the logged in user.',
    operationId: 'getMeOutreachReport',
  })
  @ApiOkResponse({ type: OutreachReport })
  @Get('me/outreach')
  async myOutreachReport(
    @Query() params: GetOutreachReport,
    @GetUser('id') id: Express.User['id'],
  ) {
    const { from, to } = params;
    return this.userService.outreachReport(id, from, to);
  }

  /**
   * Get an outreach report of the specified user.
   * @returns {OutreachReport}
   */
  @ApiOperation({
    description: 'Get an outreach report of the specified user.',
    operationId: 'getUserOutreachReport',
  })
  @ApiOkResponse({ type: OutreachReport })
  @Roles(['MENTOR'])
  @Get(':id/outreach')
  async outreachReport(
    @Param('id') userId: string,
    @Query() params: GetOutreachReport,
  ) {
    const { from, to } = params;
    return this.userService.outreachReport(userId, from, to);
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
    return this.scancodeService.scancodes({
      where: {
        userId: id,
      },
    });
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
    return this.scancodeService.scancodes({
      where: {
        userId: id,
      },
    });
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
    @GetUser('id') id: Express.User['id'],
    @Body() body: CreateScancodeDto,
  ) {
    return this.scancodeService.createScancode({
      ...body,
      user: {
        connect: {
          id,
        },
      },
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
    @Param('id') id: string,
    @Body() body: CreateScancodeDto,
  ) {
    return this.scancodeService.createScancode({
      ...body,
      user: {
        connect: {
          id,
        },
      },
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
    @GetUser('id') id: Express.User['id'],
    @Param('scancodeId') scancodeId: string,
  ) {
    const scancode = await this.scancodeService.scancode({
      code: scancodeId,
    });

    if (scancode.userId !== id) {
      throw new ForbiddenException();
    }

    return this.scancodeService.deleteScancode({
      code: scancodeId,
    });
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
    @Param('id') id: string,
    @Param('scancodeId') scancodeId: string,
  ) {
    const scancode = await this.scancodeService.scancode({
      code: scancodeId,
    });

    if (scancode.userId !== id) {
      throw new ForbiddenException();
    }

    return this.scancodeService.deleteScancode({
      code: scancodeId,
    });
  }
}
