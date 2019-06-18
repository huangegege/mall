import { PRODUCT_STATUS } from '../product.constant';
import { IsNotEmpty } from 'class-validator';

export class SetProductStatusDto {

  @IsNotEmpty()
  status: PRODUCT_STATUS;
}
