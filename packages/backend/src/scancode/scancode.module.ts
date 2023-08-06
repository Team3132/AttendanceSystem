import { Module } from '@nestjs/common';
import { ScancodeService } from './scancode.service';

@Module({
  controllers: [],
  providers: [ScancodeService],
  exports: [ScancodeService],
})
export class ScancodeModule {}
