import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { UserslikedbeersService } from './userslikedbeers.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { LikeBeerDto } from './dto/like-beer.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('userslikedbeers')
export class UserslikedbeersController {
  constructor(private userlikedbeersService: UserslikedbeersService) {}

  @Post()
  likeBeer(@GetUser('id') id: number, @Body() dto: LikeBeerDto) {
    return this.userlikedbeersService.likeBeer(id, dto.beerId);
  }

  @Delete()
  dislikeBeer(@GetUser('id') id: number, @Body() dto: LikeBeerDto) {
    return this.userlikedbeersService.dislikeBeer(id, dto.beerId);
  }
}
