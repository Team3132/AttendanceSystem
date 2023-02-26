import { SetMetadata } from '@nestjs/common';
import { ROLE } from '@/constants';

export const Roles = (roles: ROLE[]) => SetMetadata('roles', roles);
