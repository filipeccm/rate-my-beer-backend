import { IsNotEmpty, IsInt } from 'class-validator';

export class UpdateBeerRatingDto {
  @IsNotEmpty()
  @IsInt()
  beerId: number;

  @IsNotEmpty()
  @IsInt()
  rating: number;
}
