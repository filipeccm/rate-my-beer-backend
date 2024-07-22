import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { IsValidOrderBy } from './order-by-validator';

export class GetBeersQueryParamsDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  skip?: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  take?: number;

  @ValidateNested()
  @IsOptional()
  @IsValidOrderBy({ message: 'orderBy keys or values are invalid' })
  orderBy?: Prisma.BeerOrderByWithRelationInput;
}
