import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBeerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  @IsOptional()
  description: string;
}
