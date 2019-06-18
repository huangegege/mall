import { ParameterException } from '../exception/common.exception';
import { PipeTransform, ArgumentMetadata, Injectable } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { lhValidate } from './validation.util';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (!value) {
      throw new ParameterException({
        message: '未传参数'
      });
    }

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metadata)) {
      return value;
    }

    return await lhValidate(metatype, value);
  }

  private toValidate(metadata: ArgumentMetadata): boolean {
    const { metatype, type } = metadata;
    if (type === 'custom') {
      return false;
    }
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((validateType) => metatype === validateType) && !isNil(metatype);
  }
}
