import { PrismaService } from '@/prisma/prisma.service';
import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class OutreachService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Gets the outreach leaderboard (paged)
   * @returns A list of student outreach leaders and their respective outreach points
   */
  public async getOutreachLeaderBoard() {
    const rsvps = await this.prismaService.rSVP.groupBy({
      by: ['userId'],
      _sum: {},
      where: {
        event: {
          endDate: {
            gt: new Date(),
          },
        },
      },
    });
  }
}
