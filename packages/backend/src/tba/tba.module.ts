import { Module } from '@nestjs/common';
import { TbaController } from './tba.controller';
import { TbaService } from './tba.service';

@Module({
  controllers: [TbaController],
  providers: [TbaService],
})
export class TbaModule {}
