import { BadRequestException, Injectable } from '@nestjs/common';
import { Product } from './entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getManufacturerProducts(user: any): Promise<Product[]> {
    const queryResults = await this.productRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Product.manufacturer', 'Manufacturer')
      .where('Manufacturer.id = :id', { id: user.id })
      .getMany();

    return queryResults;
  }

  async postManufacturerProducts(user: any, product: any): Promise<Product> {
    const queryResults = await this.productRepository.findOneBy({
      productName: product.name,
    });
    if (queryResults) {
      throw new BadRequestException('Product already exists');
    }
    const newProduct = new Product();
    newProduct.productName = product.name;
    newProduct.description = product.description;
    newProduct.price = product.price;
    newProduct.activeStock = product.activeStock;
    newProduct.manufacturer = user;
    newProduct.requiredStock = 0;
    newProduct.pastSales = 0;

    return this.productRepository.save(newProduct);
  }
}
