import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
      passReqToCallback: true, // This allows us to pass the request object to the validate method
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    // Extract the raw token string from the Authorization header
    const authorizationHeader = req.get('Authorization');
    const refreshToken = authorizationHeader?.replace('Bearer', '').trim();
    
    // Returns payload and token string, which will be attached as req.user
    return {
      ...payload,
      refreshToken,
    };
  }
}
