import { IsNotEmpty, IsInt } from 'class-validator';

export class DeleteBeerRatingDto {
  @IsNotEmpty()
  @IsInt()
  beerId: number;
}
