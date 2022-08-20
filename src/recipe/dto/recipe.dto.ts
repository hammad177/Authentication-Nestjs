import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { IngredientsDto } from './ingredients.dto';

export class RecipeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsArray()
  @Type(() => IngredientsDto)
  @ValidateNested({ each: true })
  ingredients: IngredientsDto[];
}

export class UpdateRecipeDto extends PartialType(RecipeDto) {}
