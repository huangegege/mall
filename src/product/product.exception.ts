import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductNotFoundException extends HttpException {
  constructor({
    status = HttpStatus.NOT_FOUND,
    code = 20000,
    message = '指定商品不存在，请检查商品ID'
  } = {}) {
    super({ code, message }, status);
  }
}

export class ProductNotSaleException extends HttpException {
  constructor({
    status = HttpStatus.NOT_FOUND,
    code = 20000,
    message = '商品已下架或删除'
  } = {}) {
    super({ code, message }, status);
  }
}
