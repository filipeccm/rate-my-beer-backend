import { Module } from '@nestjs/common';
import { UsersBeersLikesService } from './users-beers-likes.service';
import { UsersBeersLikesController } from './users-beers-likes.controller';

@Module({
  providers: [UsersBeersLikesService],
  controllers: [UsersBeersLikesController],
})
export class UsersBeersLikesModule {}
