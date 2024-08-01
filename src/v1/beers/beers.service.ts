import { Injectable, NotFoundException } from '@nestjs/common';
import { Beer, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetBeersQueryParamsDto } from './dto/get-beers-params.dto';
import { OkResponse } from './dto/ok-response.dto';
import { BeerEntity } from './entity/beer.entity';

@Injectable()
export class BeersService {
  constructor(private prisma: PrismaService) {}
  async getBeers(
    params: GetBeersQueryParamsDto & { where?: Prisma.BeerWhereInput },
  ): Promise<OkResponse> {
    const { skip, take = 20, where, orderBy } = params;
    const total = await this.prisma.beer.count({ where });
    const beerResults = await this.prisma.beer.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    return {
      total,
      count: take,
      offset: skip ?? 0,
      results: beerResults,
    };
  }

  createBeer(data: Prisma.BeerCreateInput): Promise<Beer> {
    return this.prisma.beer.create({ data });
  }

  async getOneBeer(id: number): Promise<BeerEntity> {
    const beer = await this.prisma.beer.findUnique({
      where: { id },
    });
    if (!beer) throw new NotFoundException();
    return beer;
  }

  async getOneBeerRatings(id: number) {
    const beerRatings = await this.prisma.beer.findUnique({
      where: { id },
      select: {
        ratings: true,
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    if (!beerRatings) throw new NotFoundException();

    const numberOfRatings = beerRatings._count.ratings;

    if (numberOfRatings === 0) {
      return { number_of_ratings: 0, average_rating: 0 };
    }

    const totalRating = beerRatings.ratings.reduce(
      (acc, curr) => acc + curr.rating,
      0,
    );
    const avgRating = totalRating / numberOfRatings;

    return { number_of_ratings: numberOfRatings, average_rating: avgRating };
  }

  async getOneBeerLikes(id: number) {
    const beerLikes = await this.prisma.beer.findUnique({
      where: { id },
      select: {
        likedBy: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likedBy: true,
          },
        },
      },
    });

    if (!beerLikes) throw new NotFoundException();

    return {
      number_of_likes: beerLikes._count.likedBy,
      liked_by: beerLikes.likedBy,
    };
  }
}
