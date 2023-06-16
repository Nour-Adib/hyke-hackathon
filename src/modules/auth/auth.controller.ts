import {
  Body,
  Controller,
  HttpStatus,
  Request,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SignUpUserDto } from '../user/signupuser.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  //We inject the user servicec in the constructor
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup/manufacturer')
  signUpManufacturer(
    @Body() body: SignUpUserDto,
    @Request() req,
    @Res() res: Response,
  ) {
    if (body.password !== body.confirmPassword) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Passwords do not match',
      });
    }

    this.userService.findOneByEmail(body.email).then((user: User) => {
      if (user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Manufacturer already exists',
        });
      }

      if (!user) {
        this.userService.createManufacturer(body).then((user: User) => {
          const { id, name, email } = user;
          return res.status(HttpStatus.CREATED).json({ id, name, email });
        });
      }
    });
  }

  @Post('signup/retailer')
  signUpRetailer(
    @Body() body: SignUpUserDto,
    @Request() req,
    @Res() res: Response,
  ) {
    if (body.password !== body.confirmPassword) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Passwords do not match',
      });
    }

    this.userService.findOneByEmail(body.email).then((user: User) => {
      if (user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Retailer already exists',
        });
      }

      if (!user) {
        this.userService.createRetailer(body).then((user: User) => {
          const { id, name, email } = user;
          return res.status(HttpStatus.CREATED).json({ id, name, email });
        });
      }
    });
  }
}
