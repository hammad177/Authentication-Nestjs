import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}
  async getAllRecipes() {
    const recipes = await this.prisma.recipe.findMany();
    if (!recipes) {
      throw new BadRequestException(`no recipe found`);
    }
    return recipes;
  }

  async getRecipeById(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id,
      },
    });
    if (!recipe) {
      throw new BadRequestException(`no recipe found by id ${id}`);
    }
    return recipe;
  }
}
