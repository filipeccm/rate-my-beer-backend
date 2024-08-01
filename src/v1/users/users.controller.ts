import {
  Controller,
  Get,
  Delete,
  Body,
  Patch,
  UseGuards,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiExtraModels } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { LikeBeerDto } from './dto/like-beer.dto';
import { RateBeerDto } from './dto/rate-beer.dto';

@ApiExtraModels(UserEntity)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@GetUser('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@GetUser('id') id: number) {
    return this.usersService.getMe(id);
  }

  @Get(':id/liked-beers')
  getUserLikedBeers(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserLikedBeers(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/liked-beers')
  likeBeer(
    @GetUser('id') jwtUserId: number,
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: LikeBeerDto,
  ) {
    return this.usersService.likeBeer(jwtUserId, userId, dto.beerId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/liked-beers/:beerId')
  dislikeBeer(
    @GetUser('id') jwtUserId: number,
    @Param('id', ParseIntPipe) userId: number,
    @Param('beerId', ParseIntPipe) beerId: number,
  ) {
    return this.usersService.dislikeBeer(jwtUserId, userId, beerId);
  }

  @Get(':id/rated-beers')
  getUserRatedBeers(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserRatedBeers(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/rated-beers/:beerId')
  rateBeer(
    @GetUser('id') jwtUserId: number,
    @Param('id', ParseIntPipe) userId: number,
    @Param('beerId', ParseIntPipe) beerId: number,
    @Body() dto: RateBeerDto,
  ) {
    return this.usersService.rateBeer(jwtUserId, userId, beerId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/rated-beers/:beerId')
  unrateBeer(
    @GetUser('id') jwtUserId: number,
    @Param('id', ParseIntPipe) userId: number,
    @Param('beerId', ParseIntPipe) beerId: number,
  ) {
    return this.usersService.unrateBeer(jwtUserId, userId, beerId);
  }
}
