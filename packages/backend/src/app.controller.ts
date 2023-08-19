import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@ApiTags('App')
@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(private readonly config: ConfigService) {}

  /**
   * A simple hello world just for you.
   * @returns "Hello World!"
   */
  @Get()
  @ApiOperation({
    description: 'A simple hello world just for you.',
    operationId: 'helloWorld',
  })
  @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({ type: String })
  helloWorld() {
    console.log('hello world');
    return `Welcome to the TDU Attendance API. It's only accessible to TDU members. If you're a TDU member, please visit https://attendance.team3132.com/ to get started.`;
  }

  @Get('version')
  @ApiOperation({
    description: 'Get the version of the API.',
    operationId: 'version',
  })
  @ApiOkResponse({ type: String })
  version() {
    return this.config.get<string>('VERSION');
  }
}
