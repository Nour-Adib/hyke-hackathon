import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  RawBodyRequest,
  Req,
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
import { log } from 'console';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtAuthGuard, TypesGuard)
  @Get('user-products')
  @Types(UserType.Manufacturer)
  getManufacturerProducts(@Request() req, @Res() res: Response) {
    this.productService
      .getManufacturerProducts(req.user)
      .then((products) => {
        return res.status(HttpStatus.OK).json(products);
      })
      .catch((err) => {
        return res.status(err.status).json({ message: err.message });
      });
  }

  @UseGuards(JwtAuthGuard, TypesGuard)
  @Post('products')
  @Types(UserType.Manufacturer)
  postManufacturerProducts(
    @Request() req,
    @Res() res: Response,
    @Body() body: CreateProductDto,
  ) {
    this.productService
      .postManufacturerProducts(req.user, body)
      .then((products) => {
        return res.status(HttpStatus.OK).json(products);
      })
      .catch((err) => {
        log(err);
        return res.status(err.status).json({ message: err.message });
      });
  }

  @UseGuards(JwtAuthGuard)
  @Get('products-by-manufacturer/:id')
  getProductsByManufacturer(
    @Request() req,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.productService
      .getProductsByManufacturer(req.user, id)
      .then((products) => {
        return res.status(HttpStatus.OK).json(products);
      })
      .catch((err) => {
        return res.status(err.status).json({ message: err.message });
      });
  }

  //29a1b606e60ce716bf038797b942b8789ed957f3972212d6ff72645774ec5138
  @UseGuards(JwtAuthGuard)
  @Get('recommendation')
  getRecommendation(
    @Request() req,
    @Res() res: Response,
    @Query('apiKey') apiKey: string,
  ) {
    if (!apiKey) {
      throw new BadRequestException('API Key is required');
    }
    this.productService
      .getRecommendation(req.user, apiKey)
      .then((recommendation) => {
        return res.status(HttpStatus.OK).json(recommendation);
      })
      .catch((err) => {
        return res.status(err.status).json({ message: err.message });
      });
  }

  @UseGuards(JwtAuthGuard, TypesGuard)
  @Post('checkout')
  @Types(UserType.Manufacturer)
  checkout(@Request() req, @Res() res: Response) {
    this.productService
      .checkout(req.user)
      .then((response) => {
        return res.status(HttpStatus.OK).json({ message: response });
      })
      .catch((err) => {
        return res.status(err.status).json({ message: err.message });
      });
  }

  @Post('invoicing-webhook')
  async invoicingWebHook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    this.productService
      .invoicingWebHook(req.headers['stripe-signature'], req.rawBody)
      .then((result) => {
        return res.status(HttpStatus.OK).json({ message: result });
      })
      .catch((err) => {
        return res.status(err.status).json({ message: err.message });
      });
  }

  @UseGuards(JwtAuthGuard)
  @Get('product-by-id/:id')
  getProductById(
    @Request() req,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.productService
      .getProductById(id)
      .then((products) => {
        return res.status(HttpStatus.OK).json(products);
      })
      .catch((err) => {
        return res.status(err.status).json({ message: err.message });
      });
  }
}
