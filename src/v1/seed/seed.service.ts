import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async seedCategories(data: Prisma.CategoryCreateInput[]) {
    return this.prisma.category.createManyAndReturn({
      data: data,
      skipDuplicates: true,
    });
  }

  async seedStyles(data: Prisma.StyleCreateManyInput[]) {
    return this.prisma.style.createManyAndReturn({
      data: data,
      skipDuplicates: true,
    });
  }

  async seedBreweries(data: Prisma.BreweryCreateInput[]) {
    return this.prisma.brewery.createManyAndReturn({
      data,
      skipDuplicates: true,
    });
  }

  async seedBeers(data: Prisma.BeerCreateInput[]) {
    return this.prisma.beer.createManyAndReturn({
      data: data,
      skipDuplicates: true,
    });
  }

  async deleteBeers() {
    return this.prisma.$transaction([this.prisma.beer.deleteMany()]);
  }
}
