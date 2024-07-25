import { Injectable, NotFoundException } from '@nestjs/common';
import { Beer, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetBeersQueryParamsDto } from './dto/get-beers-params.dto';

@Injectable()
export class BeersService {
  constructor(private prisma: PrismaService) {}
  async getBeers(
    params: GetBeersQueryParamsDto & { where?: Prisma.BeerWhereInput },
  ) {
    const { skip, take = 20, where, orderBy } = params;
    const total = await this.prisma.beer.count({ where });
    const beerResults = await this.prisma.beer.findMany({
      skip,
      take,
      where,
      orderBy,
    });

    return {
      total,
      count: take,
      offset: skip ?? 0,
      results: beerResults,
    };
  }

  async getOneBeer(id: number): Promise<Beer> {
    const beer = await this.prisma.beer.findUnique({ where: { id: id } });
    if (!beer) throw new NotFoundException();
    return beer;
  }

  createBeer(data: Prisma.BeerCreateInput): Promise<Beer> {
    return this.prisma.beer.create({ data });
  }
}
