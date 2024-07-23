import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBeerDto } from './dto/create-beer.dto';
import { BeersService } from './beers.service';
import { Beer } from '@prisma/client';
import { GetBeersQueryParamsDto } from './dto/get-beers-params.dto';
import { AuthGuard } from '@nestjs/passport';
import { BeerEntity } from './entity/beer.entity';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(BeerEntity)
@Controller('beers')
export class BeersController {
  constructor(private readonly beersService: BeersService) {}

  @Get()
  getBeers(@Query() params: GetBeersQueryParamsDto) {
    return this.beersService.getBeers(params);
  }
  @Get(':id')
  getOneBeer(@Param('id', ParseIntPipe) id: number): Promise<Beer> {
    return this.beersService.getOneBeer(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createBeer(@Body() createBeerDto: CreateBeerDto) {
    return this.beersService.createBeer(createBeerDto);
  }
}
