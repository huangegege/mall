import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {

  @IsNotEmpty()
  readonly categoryId: number;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly subtitle: string;

  @IsNotEmpty()
  readonly mainImage: string;

  @IsNotEmpty()
  readonly subImages: string;

  @IsNotEmpty()
  readonly detail: string;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly stock: number;

  @IsNotEmpty()
  readonly status: number;
}
