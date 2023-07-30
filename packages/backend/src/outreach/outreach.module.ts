import { Module } from '@nestjs/common';
import { OutreachService } from './outreach.service';
import { OutreachController } from './outreach.controller';

@Module({
  providers: [OutreachService],
  controllers: [OutreachController],
})
export class OutreachModule {}
