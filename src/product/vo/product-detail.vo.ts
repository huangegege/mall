import { PaginationVo } from '../../core/pagination/pagination.vo';

export class ProductDetailVo {
  id: number;
  categoryId: number;
  name: string;
  subtitle: string;
  mainImage: string;
  subImages: string;
  detail: string;
  price: number;
  stock: number;
  status: number;
  createTime: Date;
  updateTime: Date;

  imageHost: string;
  parentCategoryId: number;
}

export class ProductDetailListVo extends PaginationVo<ProductDetailVo> {
  constructor(productDetailVos: ProductDetailVo[], pageNum: number, pageSize: number, total: number) {
    super(productDetailVos, pageNum, pageSize, total);
  }
}
