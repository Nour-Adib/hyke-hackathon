import { UserType } from '../../common/constants/user-type.enum';
import { BaseEntity } from '../../common/entity/base.entity';
import { EncryptionService } from '../../common/services/encryption.service';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

/**
 * User Entity Class is the class that represents the User table in the database
 * This is how we interact with the database table in the application
 * No need for SQL queries
 */
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
