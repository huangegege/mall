import { UploadVo } from './vo/upload.vo';
import { CategoryService } from '../category/category.service';
import { ParameterException } from '../core/exception/common.exception';
import { PRODUCT_STATUS } from './product.constant';
import { CategoryEntity } from '../category/category.entity';
import { SetProductStatusDto } from './dto/set-product-status.dto';
import { ProductNotFoundException, ProductNotSaleException } from './product.exception';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDetailVo, ProductDetailListVo } from './vo/product-detail.vo';
import { fileServer } from '../config';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { v4 } from 'uuid';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly categorySerice: CategoryService
  ) {}

  async create(productData: CreateProductDto): Promise<ProductEntity> {
    let productEntity = new ProductEntity();
    productEntity = Object.assign(productEntity, productData);
    const subImages = productData.subImages.split(',');
    if (subImages.length > 0) {
      productEntity.mainImage = subImages[0];
    } else {
      throw new ParameterException({
        message: '请至少上传一张图片'
      });
    }
    return await this.productRepository.save(productEntity);
  }

  async update(id: number, productData: UpdateProductDto): Promise<ProductEntity> {
    const toUpdate = await this.productRepository.findOne(id);
    if (!toUpdate) {
      throw new ProductNotFoundException();
    }
    const updated = Object.assign(toUpdate, productData);
    return await this.productRepository.save(updated);
  }

  async setStatus(id: number, productStatus: SetProductStatusDto): Promise<ProductEntity> {
    const toUpdate = await this.productRepository.findOne(id);
    if (!toUpdate) {
      throw new ProductNotFoundException();
    }
    const updated = Object.assign(toUpdate, {status: productStatus.status});
    return await this.productRepository.save(updated);
  }

  async manageDetail(id: number): Promise<ProductDetailVo> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new ProductNotFoundException();
    }
    return await this.assembleProductDetailVo(product);
  }

  private async assembleProductDetailVo(product: ProductEntity): Promise<ProductDetailVo> {
    const imageHost = fileServer.urlPrefix;
    const category = await this.categoryRepository.findOne(product.categoryId);
    let parentCategoryId = 0;
    if (category) {
      parentCategoryId = category.parentId;
    }
    return { ...product, imageHost, parentCategoryId};
  }

  async getDetail(id: number): Promise<ProductDetailVo> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new ProductNotFoundException();
    }
    if (product.status !== PRODUCT_STATUS.ON_SALE) {
      throw new ProductNotSaleException();
    }
    return await this.assembleProductDetailVo(product);
  }

  async getProductList(pageNum: number, pageSize: number): Promise<ProductDetailListVo> {
    const [ productList, total ] = await getRepository(ProductEntity)
      .createQueryBuilder('product')
      .orderBy('product.createTime', 'DESC')
      .limit(pageSize)
      .offset((pageNum - 1) * pageSize)
      .getManyAndCount();

    const productDetailVos = [];
    for (const product of productList) {
      const productDetailVo = await this.assembleProductDetailVo(product);
      productDetailVos.push(productDetailVo);
    }
    return new ProductDetailListVo(productDetailVos, pageNum, pageSize, total);
  }

  async searchProduct(productName: string, productId: number, pageNum: number, pageSize: number): Promise<ProductDetailListVo> {
    const [ productList, total ] = await getRepository(ProductEntity)
      .createQueryBuilder('product')
      .where('product.name LIKE :productName', { productName })
      .andWhere('product.id = :productId', { productId })
      .orderBy('product.createTime', 'DESC')
      .limit(pageSize)
      .offset((pageNum - 1) * pageSize)
      .getManyAndCount();

    const productDetailVos = [];
    for (const product of productList) {
      const productDetailVo = await this.assembleProductDetailVo(product);
      productDetailVos.push(productDetailVo);
    }
    return new ProductDetailListVo(productDetailVos, pageNum, pageSize, total);
  }

  async getProductByKeywordCategory(keyword: string, categoryId: number, pageNum: number, pageSize: number,
                                    orderBy: string): Promise<ProductDetailListVo> {
    // if (keyword === '' && categoryId === null) {
    //   throw new ParameterException();
    // }

    let categoryIdList = [];
    if (categoryId !== null) {
      const category = await this.categoryRepository.findOne(categoryId);
      if (!category && keyword === '') {
        // 没有该分类，并且没有关键字，这个时候返回一个空的结果集，不报错
        return new ProductDetailListVo([], pageNum, pageSize, 0);
      } else if (category) {
        categoryIdList = await this.categorySerice.selectCategoryAndChildrenById(category.id);
      }
    }

    const qb = await getRepository(ProductEntity).createQueryBuilder('product');

    qb.where('1 = 1');

    if (keyword !== '') {
      qb.andWhere('product.name LIKE :keyword', { keyword: `%${keyword}%` });
    }

    if (categoryIdList.length > 0) {
      qb.andWhere('product.categoryId IN (:categoryIdList)', { categoryIdList });
    }

    if (orderBy) {
      const orderByArray = orderBy.split('_');
      const order = orderByArray[1].toUpperCase();
      if (order === 'ASC' || order === 'DESC') {
        qb.orderBy(`product.${orderByArray[0]}`, order);
      }
    } else {
      qb.orderBy('product.createTime', 'DESC');
    }

    const [ productList, total ] = await qb
      .limit(pageSize)
      .offset((pageNum - 1) * pageSize)
      .getManyAndCount();

    const productDetailVos = [];
    for (const product of productList) {
      const productDetailVo = await this.assembleProductDetailVo(product);
      productDetailVos.push(productDetailVo);
    }
    return new ProductDetailListVo(productDetailVos, pageNum, pageSize, total);
  }

  async uploadFile(file: any): Promise<UploadVo> {
    const fileName = file.originalname;
    const fileExtensionName = fileName.substring(fileName.lastIndexOf('.') + 1);
    const uploadFileName = v4() + '.' + fileExtensionName;
    const writeFile = createWriteStream(join(__dirname, '../..', 'upload', uploadFileName));
    await new Promise((resolve, reject) => {
      writeFile.write(file.buffer, (err) => {
        if (!err) {
          resolve();
        } else {
          reject();
        }
      });
    });
    const url = fileServer.urlPrefix + uploadFileName;
    return { uri: uploadFileName, url };
  }
}
