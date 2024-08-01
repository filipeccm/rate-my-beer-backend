import { IsInt, IsNotEmpty } from 'class-validator';

export class LikeBeerDto {
  @IsNotEmpty()
  @IsInt()
  beerId: number;
}
