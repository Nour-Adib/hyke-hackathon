import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '../../../common/constants/user-type.enum';
import { TYPE_KEY } from '../../../decorators/types.decorator';
import { log } from 'console';

@Injectable()
export class TypesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredTypes = this.reflector.getAllAndOverride<UserType[]>(
      TYPE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredTypes) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    return requiredTypes.some((type) => user.userType?.includes(type));
  }
}
