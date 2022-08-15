import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { dev_config } from 'src/config';

@Injectable()
export class JwtUtils {
  constructor(private jwt: JwtService) {}

  generateAccessTokens(payload: { email: string; id: string }) {
    return this.jwt.sign(payload, { secret: 'xx-token', expiresIn: '15m' });
  }

  generateRefreshTokens(payload: { email: string; id: string }) {
    return this.jwt.sign(payload, { secret: 'rf-token', expiresIn: '7d' });
  }

  verifyToken(type: string, token: string) {
    try {
      if (type === 'refresh_token') {
        return this.jwt.verify(token, {
          secret: dev_config.JWT.REFRESH_TOKEN,
        });
      }

      if (type === 'access_token') {
        return this.jwt.verify(token, {
          secret: dev_config.JWT.ACCESS_TOKEN,
        });
      }

      // return false when the token type is not matched or the token is not verified
      return false;
    } catch (error) {
      return false;
    }
  }
}
