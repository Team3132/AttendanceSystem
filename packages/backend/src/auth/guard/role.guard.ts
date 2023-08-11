import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE, ROLES } from '@/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const logger = new Logger('RoleGuard');
    try {
      const apiRoles = this.reflector
        .get<ROLE[]>('roles', context.getHandler())
        ?.map((role) => ROLES[role]);
      if (!apiRoles) {
        return true;
      }
      const request: Express.Request = context.switchToHttp().getRequest();
      const { roles } = request.user;

      return roles.some((discordRole) =>
        apiRoles.some((apiRole) => apiRole === discordRole),
      );
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}
