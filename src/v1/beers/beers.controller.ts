import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateBeerDto } from './dto/create-beer.dto';
import { UpdateBeerDto } from './dto/update-beer.dto';
import { BeersService } from './beers.service';
import { Beer } from '@prisma/client';
import { GetBeersQueryParamsDto } from './dto/get-beers-params.dto';

@Controller('beers')
export class BeersController {
  constructor(private readonly beersService: BeersService) {}

  @Get()
  getBeers(@Query() params: GetBeersQueryParamsDto) {
    return this.beersService.getBeers(params);
  }
  @Get(':id')
  async getOneBeer(@Param('id', ParseIntPipe) id: number): Promise<Beer> {
    try {
      return await this.beersService.getOneBeer(id);
    } catch (err) {
      throw new NotFoundException();
    }
  }

  @Post()
  createBeer(@Body() createBeerDto: CreateBeerDto) {
    return this.beersService.createBeer(createBeerDto);
  }

  @Put(':id')
  updateBeer(@Param('id') id: string, @Body() updateBeerDto: UpdateBeerDto) {
    return {
      id,
      name: updateBeerDto.name,
      type: updateBeerDto.description,
    };
  }
}
