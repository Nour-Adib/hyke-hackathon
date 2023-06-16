import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpUserDto } from './signupuser.dto';
import { UserType } from 'src/common/constants/user-type.enum';

@Injectable()
export class UserService {
  /**
   * We use the repository to interact with the database
   * @param usersRepository the user repository that will be injected by the nestjs
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user object and saves it in the database
   * @param user the user object that contains the user information
   * @returns the newly created user
   */
  createManufacturer(user: SignUpUserDto): Promise<User> {
    const newUser = new User();
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.phoneNumber = user.phoneNumber;
    newUser.address = user.address;
    newUser.city = user.city;
    newUser.country = user.country;
    newUser.rating = this.generateRandomNumber(1, 5);
    newUser.numberOfRatings = this.generateRandomNumber(100, 500);

    newUser.type = UserType.Manufacturer;

    return this.usersRepository.save(newUser);
  }

  createRetailer(user: SignUpUserDto): Promise<User> {
    const newUser = new User();
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.phoneNumber = user.phoneNumber;
    newUser.address = user.address;
    newUser.city = user.city;
    newUser.country = user.country;
    newUser.rating = this.generateRandomNumber(3, 5);
    newUser.numberOfRatings = this.generateRandomNumber(100, 500);

    newUser.type = UserType.Retailer;

    return this.usersRepository.save(newUser);
  }

  getLoginUser(email: string): Promise<User> {
    return this.usersRepository
      .createQueryBuilder()
      .select(['id', 'email', 'password', 'role', 'subscriptionPlan'])
      .where('email = :email', { email: email })
      .getRawOne();
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email: email });
  }

  generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
