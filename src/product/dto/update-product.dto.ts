export class UpdateProductDto {
  readonly categoryId: number;
  readonly name: string;
  readonly subtitle: string;
  readonly mainImage: string;
  readonly subImages: string;
  readonly detail: string;
  readonly price: number;
  readonly stock: number;
  readonly status: number;
}
