import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Connection } from 'typeorm';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { AppController } from './app.controller';
import { LoggerModule } from './core/logger/logger.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ShippingModule } from './shipping/shipping.module';
import { AllExceptionFilter } from './core/exception/exception.filter';
import { LOGGER_LEVEL } from './core/logger/logger.constants';

@Module({
  imports: [
    // Global
    LoggerModule,

    TypeOrmModule.forRoot(),
    MorganModule.forRoot(),
    UserModule,
    CategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
    ShippingModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined', {
        skip: (req, res) => process.env.LOGGER_LEVEL === LOGGER_LEVEL.INFO
      })
    }
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
