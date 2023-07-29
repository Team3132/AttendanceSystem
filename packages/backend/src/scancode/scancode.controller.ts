import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  ConflictException,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ScancodeService } from './scancode.service';
import { CreateScancodeDto } from './dto/create-scancode.dto';
import { GetUser } from '@auth/decorators/GetUserDecorator.decorator';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SessionGuard } from '@auth/guard/session.guard';
import { Scancode } from './entities/scancode.entity';
import { ROLES } from '../constants';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';

@ApiTags('Scancode')
@UseGuards(SessionGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiCookieAuth()
@Controller('scancode')
export class ScancodeController {
  constructor(
    private readonly scancodeService: ScancodeService,
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
  ) {}

  /**
   * Create Scancode
   * @returns {Scancode}
   */
  @Post()
  @ApiOperation({
    description: 'Get a scancode by code',
    operationId: 'getScancode',
  })
  @ApiCreatedResponse({ type: Scancode })
  async create(
    @GetUser('id') userId: Express.User['id'],
    @Body() createScancodeDto: CreateScancodeDto,
  ) {
    const response = await this.scancodeService.createScancode({
      ...createScancodeDto,
      userId,
    });
    return new Scancode(response);
  }

  /**
   * Get a list of all scancodes for the signed in user
   * @returns {Scancode[]}
   */
  @ApiOkResponse({ type: [Scancode] })
  @ApiOperation({
    description: 'Get a list of all scancodes for the signed in user',
    operationId: 'getScancodes',
  })
  @Get()
  async findAll(@GetUser('id') userId: Express.User['id']) {
    const scancodes = await this.db.query.scancode.findMany({
      where: (scancode, { eq }) => eq(scancode.userId, userId),
    });
    return scancodes.map((scancode) => new Scancode(scancode));
  }

  /**
   * Delete a scancode by code
   * @returns {Scancode}
   */
  @ApiOkResponse({ type: Scancode })
  @ApiOperation({
    description: 'Delete a scancode by code',
    operationId: 'deleteScancode',
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: Express.User) {
    const scancode = await this.db.query.scancode.findFirst({
      where: (scancode, { eq }) => eq(scancode.code, id),
    });
    if (scancode.userId !== user.id && !user.roles.includes(ROLES.MENTOR)) {
      throw new ForbiddenException();
    }
    return this.scancodeService.deleteScancode(id);
  }
}
