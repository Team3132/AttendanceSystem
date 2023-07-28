import { SessionGuard } from '@/auth/guard/session.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Outreach')
@UseGuards(SessionGuard)
@Controller('outreach')
export class OutreachController {}
