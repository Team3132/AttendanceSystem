import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

@Injectable()
export class AuthenticatorService {
  /**
   * Generates a unique secret (store in event)
   * @returns {string} The authenticator token
   */
  generateSecret() {
    return authenticator.generateSecret();
  }

  /**
   * verifies that the provided secret is valid when compared to the provided token
   * @param secret The event secret to check against
   * @param token The user-provided token
   * @returns {boolean} isValid
   */
  verifyToken(secret: string, token: string) {
    return authenticator.verify({ token, secret });
  }

  /**
   * Generates a code from the secret
   * @param secret The event secret to check against
   * @returns {string} The authenticator token
   */
  getToken(secret: string) {
    return authenticator.generate(secret);
  }
}
