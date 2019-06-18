import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor({
    status = HttpStatus.UNAUTHORIZED,
    code = 20000,
    message = '用户未找到'
  } = {}) {
    super({ code, message }, status);
  }
}

export class UnAuthorizedException extends HttpException {
  constructor({
    status = HttpStatus.UNAUTHORIZED,
    code = 20100,
    message = '未授权'
  } = {}) {
    super({ code, message }, status);
  }
}

export class NotUniqueException extends HttpException {
  constructor({
    status = HttpStatus.BAD_REQUEST,
    code = 20200,
    message = '用户名和邮箱必须唯一'
  } = {}) {
    super({ code, message }, status);
  }
}

export class WechatException extends HttpException {
  constructor({
    status = HttpStatus.BAD_REQUEST,
    code = 9999,
    message = '获取openid失败'
  } = {}) {
    super({ code, message }, status);
  }
}
