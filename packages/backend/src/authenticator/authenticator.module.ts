import { Module } from '@nestjs/common';
import { AuthenticatorService } from './authenticator.service';

@Module({
  imports: [],
  providers: [AuthenticatorService],
  exports: [AuthenticatorService],
})
export class AuthenticatorModule {}
