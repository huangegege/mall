import { ParameterException } from '../exception/common.exception';
import { plainToClass } from 'class-transformer';
import { sanitize } from 'class-sanitizer';
import {
  validate as classValidate,
  validateSync as classValidateSync,
  ValidatorOptions
} from 'class-validator';
import { ClassType } from 'class-transformer/ClassTransformer';

/**
 * Validate value for validator
 * @param {ClassType<T>} validation
 * @param {object} value
 * @return {Promise<T>}
 */
export const lhValidate = async <T>(validation: ClassType<T>, value: object): Promise<T> => {

  // Transform to class
  const entity = plainToClass<T, object>(validation, value);

  // Sanitize
  sanitize(entity);

  // Validate
  const errors = await classValidate(
    entity,
    { skipMissingProperties: true, whitelist: true } as ValidatorOptions
  );

  if (errors.length > 0) {
    throw new ParameterException({
      message: buildError(errors)
    });
  }

  return entity;
};

export const lhValidateSync = <T>(validation: ClassType<T>, value: object): T => {

  // Transform to class
  const entity = plainToClass<T, object>(validation, value);

  // Sanitize
  sanitize(entity);

  // Validate
  const errors = classValidateSync(
    entity,
    { skipMissingProperties: true, whitelist: true } as ValidatorOptions
  );

  if (errors.length > 0) {
    throw new ParameterException({
      message: buildError(errors)
    });
  }

  return entity;
};

const buildError = (errors) => {
  let result = '';
  errors.forEach(el => {
    Object.entries(el.constraints).forEach(constraint => {
      result += `${constraint[1]}, `;
    });
  });
  if (result.length > 0) {
    result = result.substring(0, result.length - 2);
  }
  return result;
};
