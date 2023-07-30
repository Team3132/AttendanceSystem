import { SessionGuard } from '@/auth/guard/session.guard';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OutreachService } from './outreach.service';
import { LeaderboardDto } from './dto/LeaderboardDto';

@ApiTags('Outreach')
@UseGuards(SessionGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('outreach')
export class OutreachController {
  constructor(private readonly outreachService: OutreachService) {}

  @Get('leaderboard')
  @ApiOkResponse({
    type: [LeaderboardDto],
  })
  async getOutreachLeaderboard() {
    const res = await this.outreachService.getOutreachLeaderBoard();

    return res.map((singleData) => new LeaderboardDto(singleData));
  }
}
