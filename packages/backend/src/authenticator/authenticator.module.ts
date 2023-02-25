import { Module } from '@nestjs/common';
import { AuthenticatorGateway } from './authenticator.gateway';
import { AuthenticatorService } from './authenticator.service';

@Module({
  imports: [],
  providers: [AuthenticatorGateway, AuthenticatorService],
  exports: [AuthenticatorService],
})
export class AuthenticatorModule {}
