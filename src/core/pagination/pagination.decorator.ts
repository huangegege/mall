import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { PaginationDto } from './pagination.dto';
import { lhValidateSync } from '../validation/validation.util';

export const Pagination = createParamDecorator(
  (data: any, req: Request): PaginationDto => {
    return lhValidateSync(PaginationDto, req.query);
  }
);
