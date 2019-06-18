import { CategoryService } from './category.service';
import { Controller, Get, Post, Param, Put } from '@nestjs/common';

@Controller('category')
export class CategoryController {
  constructor(private readonly categorySevice: CategoryService) {}

  @Post(':name/:parentId')
  async create(@Param('name') name: string, @Param('parentId') parentId: number) {
    return this.categorySevice.create(name, parentId);
  }

  @Put('name/:id/:name')
  async setName(@Param('id') id: number, @Param('name') name: string) {
    return this.categorySevice.updateCategoryName(id, name);
  }

  @Get(':id')
  async getChildrenParallelCategory(@Param('id') id: number) {
    return this.categorySevice.getChildrenParallelCategory(id);
  }

  @Get('deep/:id')
  async getCategoryAndDeepChildrenCategory(@Param('id') id: number) {
    return this.categorySevice.selectCategoryAndChildrenById(id);
  }
}
