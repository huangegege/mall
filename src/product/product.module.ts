import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from '../category/category.entity';
import { ProductService } from './product.service';
import { CategoryService } from '../category/category.service';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity]), UserModule],
  providers: [ProductService, CategoryService],
  controllers: [ProductController]
})
export class ProductModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {path: 'product', method: RequestMethod.POST}
      );
  }
}
