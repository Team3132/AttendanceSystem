import {
  Controller,
  Get,
  Redirect,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ROLES } from '@/constants';
import { GetUser } from './decorators/GetUserDecorator.decorator';
import { AuthStatusDto } from './dto/AuthStatus.dto';
import { DiscordAuthGuard } from './guard/discord.guard';
import { SessionGuard } from './guard/session.guard';
import { ConfigService } from '@nestjs/config';
import { BotService } from '../bot/bot.service';
import { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly botService: BotService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Auth Status
   * @returns {AuthStatusDto}
   */
  @ApiOperation({ description: 'Get auth status', operationId: 'authStatus' })
  @ApiOkResponse({ type: AuthStatusDto })
  @Get('status')
  async status(@GetUser() user: Express.User): Promise<AuthStatusDto> {
    const isAdmin = user?.roles.includes(ROLES.MENTOR);

    return {
      isAuthenticated: !!user,
      isAdmin: !!isAdmin,
    };
  }

  /**
   * Sign in using discord
   */
  @ApiOperation({
    description: 'Sign in using discord',
    operationId: 'discordSignin',
  })
  @UseGuards(DiscordAuthGuard)
  @Get('discord')
  discordSignin() {
    // Operation handled by the discord auth guard
  }

  /**pstr
   * Sign in using discord (callback)
   * @returns close window script
   */
  @ApiOperation({
    description: 'Sign in using discord (callback)',
    operationId: 'discordSigninCallback',
  })
  @UseGuards(DiscordAuthGuard)
  @Get('discord/callback')
  discordSigninCallback(@Req() req: Request, @Res() res: Response) {
    const url =
      req.cookies['redirectTo'] ??
      `${this.configService.getOrThrow('FRONTEND_URL')}/calendar`;
    return res.status(302).clearCookie('redirectTo').redirect(url);
    // res.redirect('back');
  }

  @ApiOperation({
    description: 'Sign out',
    operationId: 'signout',
  })
  @UseGuards(SessionGuard)
  @Get('logout')
  @Redirect()
  async logout(@Session() session: Express.Request['session']) {
    session.destroy(() => null);

    return { url: this.configService.getOrThrow('FRONTEND_URL') };
  }
}
