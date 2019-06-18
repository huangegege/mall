import { CategoryEntity } from './category.entity';

export interface CategoriesRO {
  categories: CategoryEntity[];
}

export interface CategoryIdsRO {
  categoryIds: number[];
}
