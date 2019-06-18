import { HttpException, HttpStatus } from '@nestjs/common';

export class ParameterException extends HttpException {
  constructor({
    status = HttpStatus.BAD_REQUEST,
    code = 10000,
    message = '参数错误'
  } = {}) {
    super({ code, message }, status);
  }
}
