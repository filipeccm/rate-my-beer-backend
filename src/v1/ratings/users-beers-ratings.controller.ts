import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UsersBeersRatingsService } from './users-beers-ratings.service';
import { CreateBeerRatingDto } from './dto/create-beer-rating.dto';
import { DeleteBeerRatingDto } from './dto/delete-beer-rating.dto';
import { UpdateBeerRatingDto } from './dto/update-beer-rating.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('users-beers-ratings')
export class UsersBeersRatingsController {
  constructor(private usersBeersRatingsService: UsersBeersRatingsService) {}
  @Post()
  createRating(@GetUser('id') id: number, @Body() dto: CreateBeerRatingDto) {
    return this.usersBeersRatingsService.createRating(id, dto);
  }

  @Patch()
  updateRating(@GetUser('id') id: number, @Body() dto: UpdateBeerRatingDto) {
    return this.usersBeersRatingsService.updateRating(id, dto);
  }

  @Delete()
  deleteRating(@GetUser('id') id: number, @Body() dto: DeleteBeerRatingDto) {
    return this.usersBeersRatingsService.deleteRating(id, dto);
  }
}
