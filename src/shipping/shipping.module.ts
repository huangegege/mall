import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ShippingController } from './shipping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingEntity } from './shipping.entity';
import { ShippingService } from './shipping.service';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingEntity]), UserModule],
  providers: [ShippingService],
  controllers: [ShippingController]
})
export class ShippingModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware);
  }
}
