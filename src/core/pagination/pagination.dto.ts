import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {

  @IsNumber() @Min(1) @Type(() => Number)
  pageNum: number = 1;

  @IsNumber() @Min(1) @Type(() => Number)
  pageSize: number = 10;
}
