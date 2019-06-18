import { CategoryNotFoundException } from './category.exception';
import { CategoriesRO, CategoryIdsRO } from './category.interface';
import { CategoryEntity } from './category.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}

  async create(name: string, parentId: number): Promise<CategoryEntity> {
    const category = new CategoryEntity();
    category.name = name;
    category.parentId = parentId;
    return await this.categoryRepository.save(category);
  }

  async updateCategoryName(id: number, name: string): Promise<CategoryEntity> {
    const toUpdate = await this.categoryRepository.findOne(id);
    if (!toUpdate) {
      throw new CategoryNotFoundException();
    }
    const updated = Object.assign(toUpdate, { name });
    return await this.categoryRepository.save(updated);
  }

  async getChildrenParallelCategory(id: number): Promise<CategoriesRO> {
    const categories = await this.categoryRepository.find({ parentId: id });
    return { categories };
  }

  async selectCategoryAndChildrenById(id: number): Promise<CategoryIdsRO> {
    const categoryIds = [];
    const categories = [];
    await this.findChildCategory(categories, id);

    for (const category of categories) {
      categoryIds.push(category.id);
    }
    return { categoryIds };
  }

  private async findChildCategory(categories: CategoryEntity[], id: number) {
    const category = await this.categoryRepository.findOne(id);
    if (category) {
      categories.push(category);
    }
    const categoryList = await this.categoryRepository.find({ parentId: id });
    for (const categoryItem of categoryList) {
      await this.findChildCategory(categories, categoryItem.id);
    }
  }
}
