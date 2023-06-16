import { SetMetadata } from '@nestjs/common';
import { UserType } from '../common/constants/user-type.enum';

export const TYPE_KEY = 'user_types';
export const Types = (...types: UserType[]) => SetMetadata(TYPE_KEY, types);
