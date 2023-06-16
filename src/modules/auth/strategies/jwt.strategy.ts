import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import jwtConfig from '../constants';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      //Extract the token from the authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //Ensure that the token has not expired
      ignoreExpiration: false,
      //Use the secret to verify the token
      secretOrKey: jwtConfig.secret,
    });
  }

  //Invoked after Passport has verified the token
  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      subscriptionPlan: payload.subscriptionPlan,
    };
  }
}
