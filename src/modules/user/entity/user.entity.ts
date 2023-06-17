import { UserType } from '../../../common/constants/user-type.enum';
import { BaseEntity } from '../../../common/entity/base.entity';
import { EncryptionService } from '../../../common/services/encryption.service';
import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entity/product.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  type: UserType;

  @Column()
  phoneNumber: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  rating: number;

  @Column()
  numberOfRatings: number;

  @Column({ default: false })
  hasStripAccount: boolean = false;

  @Column({ default: '' })
  stripeCustomerId: string = '';

  @Column({ default: '' })
  apiKey: string = '';

  @OneToMany(() => Product, (product) => product.manufacturer)
  products: Product[];

  //This is a hook that will be executed before the user is inserted in the database
  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await new EncryptionService().encryptPassword(
      this.password,
    );
  }
}
