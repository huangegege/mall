import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryNotFoundException extends HttpException {
  constructor({
    status = HttpStatus.NOT_FOUND,
    code = 20000,
    message = '指定类目不存在，请检查类目ID'
  } = {}) {
    super({ code, message }, status);
  }
}
