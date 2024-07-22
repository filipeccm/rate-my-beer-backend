import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UpdateBeerDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  description: string;
}
