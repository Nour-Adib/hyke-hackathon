import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { log } from 'console';

/**
 * Local strategy for passport
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validates the user using password
   * @param email email of the user
   * @param password password input by the user
   * @returns the user details or throws an UnauthorizedException if the user is not found or has an invalid password
   */
  async validate(email: string, password: string): Promise<any> {
    return this.authService.validateUser(email, password).then((user) => {
      if (!user) {
        console.log('User not found');

        throw new UnauthorizedException();
      }
      return user;
    });
  }
}
