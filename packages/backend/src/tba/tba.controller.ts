import { CacheInterceptor, Controller, Get, NotFoundException, UseInterceptors } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TBAEventDto } from './dto/TBAEvent.dto';
import { TbaService } from './tba.service';

@Controller('tba')
export class TbaController {
  constructor(private readonly tbaService: TbaService) {}

  @Get('events/next')
  @ApiOkResponse({ type: TBAEventDto })
  @UseInterceptors(CacheInterceptor)
  @ApiNotFoundResponse({ type: String, status: 404 })
  async getNextEvent(): Promise<TBAEventDto> {
    const nextEvent = await this.tbaService.getNextEvent();
    if (!nextEvent) {
      throw new NotFoundException('No next event found');
    }
    return nextEvent;
  }
}
