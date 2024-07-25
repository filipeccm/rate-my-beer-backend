import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateBeerDto implements Prisma.BeerCreateInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  @IsOptional()
  descript?: string;

  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 1,
  })
  abv?: number;

  @IsOptional()
  @IsInt()
  ibu?: number;

  @IsOptional()
  @IsInt()
  srm?: number;
}
