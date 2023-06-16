import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SignUpUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsPhoneNumber('AE')
  phoneNumber: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  country: string;
}
