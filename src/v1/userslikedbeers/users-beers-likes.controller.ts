import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { UsersBeersLikesService } from './users-beers-likes.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { LikeBeerDto } from './dto/like-beer.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('users-beers-likes')
export class UsersBeersLikesController {
  constructor(private usersBeersLikes: UsersBeersLikesService) {}

  @Post()
  likeBeer(@GetUser('id') id: number, @Body() dto: LikeBeerDto) {
    return this.usersBeersLikes.likeBeer(id, dto.beerId);
  }

  @Delete()
  dislikeBeer(@GetUser('id') id: number, @Body() dto: LikeBeerDto) {
    return this.usersBeersLikes.dislikeBeer(id, dto.beerId);
  }
}
