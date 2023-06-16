import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductService } from './product.service';
import { TypesGuard } from '../auth/guards/type-auth.guard';
import { UserType } from 'src/common/constants/user-type.enum';
import { Types } from 'src/decorators/types.decorator';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtAuthGuard, TypesGuard)
  @Get('manufacturer-products')
  @Types(UserType.Manufacturer)
  getManufacturerProducts(@Request() req, @Res() res: Response) {
    this.productService
      .getManufacturerProducts(req.user)
      .then((posts) => {
        return res.status(HttpStatus.OK).json(posts);
      })
      .catch((err) => {
        return res.status(err.status).json({ message: err.message });
      });
  }

  @UseGuards(JwtAuthGuard, TypesGuard)
  @Post('manufacturer-products')
  @Types(UserType.Manufacturer)
  postManufacturerProducts(
    @Request() req,
    @Res() res: Response,
    @Body() body: CreateProductDto,
  ) {
    this.productService
      .postManufacturerProducts(req.user, body)
      .then((posts) => {
        return res.status(HttpStatus.OK).json(posts);
      })
      .catch((err) => {
        return res.status(err.status).json({ message: err.message });
      });
  }
}
