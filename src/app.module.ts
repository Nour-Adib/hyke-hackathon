import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/entity/user.entity';
import { Product } from './modules/product/entity/product.entity';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      //We import the ConfigModule to use the ConfigService to access the environment variables
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        //*Database Settings
        type: 'mysql',
        //We get get the value of the environment variable DATABASE_HOST
        host: configService.get<string>('DATABASE_HOST'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Product],
        synchronize: false,
        autoLoadEntities: true,
        options: { encrypt: false },
        //*Migrations Settings
        //Migrations Table Name
        migrationsTableName: 'migrations',
        //Migrations Folder
        migrations: ['../migrations/*{.ts,.js}'],
        //Automatically run migrations on app start if needed
        migrationsRun: true,
        port: 3306,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
