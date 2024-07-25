import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBeerRatingDto {
  @IsNotEmpty()
  @IsInt()
  beerId: number;

  @IsNotEmpty()
  @IsInt()
  rating: number;
}
