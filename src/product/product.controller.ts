import { PaginationDto } from './../core/pagination/pagination.dto';
import { SetProductStatusDto } from './dto/set-product-status.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ValidationPipe } from '../core/validation/validation.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { Controller, Get, Post, Put, Body, UsePipes, Param, Query } from '@nestjs/common';
import { Pagination } from '../core/pagination/pagination.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Post('manage')
  async create(@Body() productData: CreateProductDto) {
    return await this.productService.create(productData);
  }

  @Put('manage/:id')
  async update(@Param('id') id: number, @Body() productData: UpdateProductDto) {
    return await this.productService.update(id, productData);
  }

  @UsePipes(new ValidationPipe())
  @Put('manage/status/:id')
  async setStatus(@Param('id') id: number, @Body() productStatus: SetProductStatusDto) {
    return await this.productService.setStatus(id, productStatus);
  }

  @Get('manage/detail/:id')
  async manageDetail(@Param('id') id: number) {
    return await this.productService.manageDetail(id);
  }

  @Get('manage/list')
  async manageList(@Pagination() pagination: PaginationDto) {
    return await this.productService.getProductList(pagination.pageNum, pagination.pageSize);
  }

  @Get('manage/search/:productName/:productId')
  async manageSearch(
    @Param('productName') productName: string,
    @Param('productId') productId: number,
    @Pagination() pagination: PaginationDto
  ) {
    return await this.productService.searchProduct(productName, productId,
      pagination.pageNum, pagination.pageSize);
  }

  @Get('detail/:id')
  async getDetail(@Param('id') id: number) {
    return await this.productService.getDetail(id);
  }

  @Get('search/full/:keyword/:categoryId')
  async list(
    @Param('keyword') keyword: string,
    @Param('categoryId') categoryId: number,
    @Pagination() pagination: PaginationDto,
    @Query('orderBy') orderBy: string
  ) {
    return await this.productService.getProductByKeywordCategory(keyword, categoryId,
      pagination.pageNum, pagination.pageSize, orderBy);
  }

  @Get('search/keyword/:keyword')
  async searchByKeyword(
    @Param('keyword') keyword: string,
    @Pagination() pagination: PaginationDto,
    @Query('orderBy') orderBy: string
  ) {
    return await this.productService.getProductByKeywordCategory(keyword, null,
      pagination.pageNum, pagination.pageSize, orderBy);
  }

  @Get('search/categoryId/:categoryId')
  async searchByCategoryId(
    @Param('categoryId') categoryId: number,
    @Pagination() pagination: PaginationDto,
    @Query('orderBy') orderBy: string
  ) {
    return await this.productService.getProductByKeywordCategory('', categoryId,
      pagination.pageNum, pagination.pageSize, orderBy);
  }
}
