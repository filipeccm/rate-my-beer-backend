import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/role/role.guard';
import { Prisma } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@Controller('seed')
export class SeedController {
  constructor(private seedService: SeedService) {}

  @Post('categories')
  seedCategories(@Body() data: Prisma.CategoryCreateInput[]) {
    return this.seedService.seedCategories(data);
  }

  @Post('styles')
  seedStyles(@Body() data: Prisma.StyleCreateManyInput[]) {
    return this.seedService.seedStyles(data);
  }

  @Post('breweries')
  seedBrewery(@Body() data: Prisma.BreweryCreateInput[]) {
    return this.seedService.seedBreweries(data);
  }

  @Post('beers')
  seedBeers(@Body() data: Prisma.BeerCreateInput[]) {
    return this.seedService.seedBeers(data);
  }

  @Delete('beers')
  deleteBeers() {
    return this.seedService.deleteBeers();
  }
}
