import { IsNotEmpty, IsString } from 'class-validator';

export class IngredientsDto {
  @IsNotEmpty()
  @IsString()
  item_name: string;

  @IsNotEmpty()
  @IsString()
  quantity: string;
}
