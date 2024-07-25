import { Module } from '@nestjs/common';
import { UsersBeersRatingsController } from './users-beers-ratings.controller';
import { UsersBeersRatingsService } from './users-beers-ratings.service';

@Module({
  controllers: [UsersBeersRatingsController],
  providers: [UsersBeersRatingsService],
})
export class UsersBeersRatingsModule {}
