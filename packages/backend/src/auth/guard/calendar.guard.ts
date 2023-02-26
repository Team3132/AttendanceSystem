import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CalendarGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const secret = request.query['secret'] as string;
    if (!secret) {
      return false;
    }
    const user = await this.prismaService.user.findUnique({
      where: { calendarSecret: secret },
    });
    return !!user;
  }
}
