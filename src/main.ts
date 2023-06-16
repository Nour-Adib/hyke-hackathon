import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  /**
   * Enable CORS
   * @description This is required for the web interface to work
   * @see https://docs.nestjs.com/techniques/cors
   */
   app.enableCors();

   /**
    * Enable global validation
    * @description This is required for the dto validation to work
    * @see https://docs.nestjs.com/techniques/validation
    */
   app.useGlobalPipes(
     new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } })
   );
  
  await app.listen(3000);
}
bootstrap();
