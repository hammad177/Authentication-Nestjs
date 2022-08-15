import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
