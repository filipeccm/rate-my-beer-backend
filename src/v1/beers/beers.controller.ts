import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBeerDto } from './dto/create-beer.dto';
import { BeersService } from './beers.service';
import { GetBeersQueryParamsDto } from './dto/get-beers-params.dto';
import { AuthGuard } from '@nestjs/passport';
import { BeerEntity } from './entity/beer.entity';
import { ApiExtraModels } from '@nestjs/swagger';
import { OkResponse } from './dto/ok-response.dto';

@ApiExtraModels(BeerEntity)
@Controller('beers')
export class BeersController {
  constructor(private readonly beersService: BeersService) {}

  @Get()
  getBeers(@Query() params: GetBeersQueryParamsDto): Promise<OkResponse> {
    return this.beersService.getBeers(params);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createBeer(@Body() createBeerDto: CreateBeerDto) {
    return this.beersService.createBeer(createBeerDto);
  }

  @Get(':id')
  getOneBeer(@Param('id', ParseIntPipe) id: number): Promise<BeerEntity> {
    return this.beersService.getOneBeer(id);
  }

  @Get(':id/ratings')
  getOneBeerRatings(@Param('id', ParseIntPipe) id: number) {
    return this.beersService.getOneBeerRatings(id);
  }

  @Get(':id/likes')
  getOneBeerLikes(@Param('id', ParseIntPipe) id: number) {
    return this.beersService.getOneBeerLikes(id);
  }
}
