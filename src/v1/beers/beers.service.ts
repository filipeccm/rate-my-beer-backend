import { Injectable } from '@nestjs/common';
import { Beer, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetBeersQueryParamsDto } from './dto/get-beers-params.dto';

@Injectable()
export class BeersService {
  constructor(private prisma: PrismaService) {}
  async getBeers(
    params: GetBeersQueryParamsDto & { where?: Prisma.BeerWhereInput },
  ): Promise<Beer[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.beer.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async getOneBeer(id: number): Promise<Beer> {
    return this.prisma.beer.findUnique({ where: { id: id } });
  }

  async createBeer(data: Prisma.BeerCreateInput): Promise<Beer> {
    return this.prisma.beer.create({ data });
  }
}
