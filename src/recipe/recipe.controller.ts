import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecipeDto } from './dto';
import { RecipeService } from './recipe.service';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createRecipe(
    @Body() dto: RecipeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Please upload image');
    }
    return 'working';
  }

  @Get('/all')
  getAllRecipes() {
    return this.recipeService.getAllRecipes();
  }

  @Get(':id')
  getRecipeById(@Param() param: { id: string }) {
    return this.recipeService.getRecipeById(param.id);
  }
}
