import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { IsValidOrderBy } from './order-by-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    type: 'Object',
    example: {
      createdAt: 'desc',
    },
    description: `Order the beers by one of its fields. The value can be either "asc" or "desc"`,
  })
  @ValidateNested()
  @IsOptional()
  @IsValidOrderBy({ message: 'orderBy keys or values are invalid' })
  orderBy?: Prisma.BeerOrderByWithRelationInput;
}
