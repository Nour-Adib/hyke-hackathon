import { BadRequestException, Injectable } from '@nestjs/common';
import { Product } from './entity/product.entity';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { log } from 'console';
import { randomBytes } from 'crypto';
import { EncryptionService } from 'src/common/services/encryption.service';
dotenv.config();

@Injectable()
export class ProductService {
  private stripe = new Stripe(process.env?.STRIPE_TEST_KEY, {
    apiVersion: '2022-11-15',
  });

  private endpointSecret = process.env?.STRIPE_WEBHOOK_SECRET;

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async getProductsByManufacturer(user: any, id: string): Promise<Product[]> {
    const queryResults = await this.productRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Product.manufacturer', 'Manufacturer')
      .where('Manufacturer.id = :id', { id })
      .getMany();

    return queryResults;
  }

  async getRecommendation(user: any, apiKey: string): Promise<any> {
    const dbUser = await this.userRepository.findOneBy({ id: user.id });

    const isAPIKeyMatch = await new EncryptionService().comparePasswords(
      apiKey,
      dbUser.apiKey,
    );

    if (!isAPIKeyMatch) {
      throw new BadRequestException('Invalid API Key');
    }

    const subscriptions = await this.stripe.subscriptions.list({
      customer: dbUser.stripeCustomerId,
      limit: 1,
    });

    const subscriptionItems = await this.stripe.subscriptionItems.list({
      subscription: subscriptions.data[0].id,
    });

    log(subscriptionItems);

    const record = await this.stripe.subscriptionItems.createUsageRecord(
      subscriptionItems.data[0].id as string,
      {
        quantity: 1,
        timestamp: 'now',
        action: 'increment',
      },
    );
  }

  async checkout(user: any): Promise<string> {
    const dbUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    let newUser = false;
    let customer: Stripe.Customer;

    if (!dbUser.hasStripAccount) {
      customer = await this.stripe.customers.create({
        email: dbUser.email,
        name: dbUser.name,
        phone: dbUser.phoneNumber,
      });

      newUser = true;

      await this.userRepository.update(dbUser.id, {
        stripeCustomerId: customer.id,
        hasStripAccount: true,
      });
    }

    if (dbUser.hasStripAccount) {
      throw new BadRequestException('User already has an active subscription');
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: newUser ? customer.id : dbUser.stripeCustomerId,
      line_items: [
        {
          price: 'price_1NJsxpJYMS8mbG4Wla3wLWgj',
        },
      ],
      success_url: `https://localhost:3000/product/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://localhost:3000/product/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });

    return session.url;
  }

  async invoicingWebHook(stripeSignature: any, body: any) {
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        stripeSignature,
        this.endpointSecret,
      );
    } catch (err) {
      return new BadRequestException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const customerId = event.data.object.customer;

        const keys = await this.generateAPIKey();
        const apiKey = keys.key;
        const hashedAPIKey = keys.encryptedKey;
        const user = await this.userRepository.findOneBy({
          stripeCustomerId: customerId,
        });

        console.log(`User's API Key: ${apiKey}`);

        await this.userRepository.update(user.id, {
          apiKey: hashedAPIKey,
        });

        break;
      case 'invoice.paid':
        break;
      case 'invoice.payment_failed':
        break;
      default:
    }
  }

  async generateAPIKey(): Promise<any> {
    const key = randomBytes(32).toString('hex');
    const encryptedKey = await new EncryptionService().encryptPassword(key);
    const isUnique = await this.userRepository.findBy({
      apiKey: encryptedKey,
    });

    // Ensure API key is unique
    if (!isUnique) {
      this.generateAPIKey();
    } else {
      return { key, encryptedKey };
    }
  }

  async getProductById(id: string): Promise<Product> {
    return this.productRepository.findOneBy({ id });
  }
}
