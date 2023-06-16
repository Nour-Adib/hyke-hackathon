import { User } from '../../../modules/user/entity/user.entity';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productName: string;

  @Column()
  description: string;

  @Column()
  activeStock: number;

  @Column()
  price: number;

  @Column()
  requiredStock: number;

  @Column()
  pastSales: number;

  @ManyToOne(() => User, (manufacturer) => manufacturer.products)
  manufacturer: User;
}
