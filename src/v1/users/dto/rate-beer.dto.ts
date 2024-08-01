import { IsInt, IsNotEmpty } from 'class-validator';

export class RateBeerDto {
  @IsNotEmpty()
  @IsInt()
  rating: number;
}
