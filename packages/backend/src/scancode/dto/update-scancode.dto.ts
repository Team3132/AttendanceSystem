import { PartialType } from '@nestjs/swagger';
import { CreateScancodeDto } from './create-scancode.dto';

export class UpdateScancodeDto extends PartialType(CreateScancodeDto) {}
