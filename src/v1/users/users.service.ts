import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RateBeerDto } from './dto/rate-beer.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
      select: {
        name: true,
        email: true,
      },
    });

    return user;
  }

  getMe(id: number) {
    const user = this.prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        likedBeers: {
          select: {
            beer: true,
          },
        },
      },
    });

    return user;
  }

  async getUserLikedBeers(id: number) {
    const likedBeers = await this.prisma.usersBeersLikes.findMany({
      where: { userId: id },
      select: {
        beer: true,
      },
    });

    if (!likedBeers.length) {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      return [];
    }

    return {
      total: likedBeers.length,
      liked_beers: likedBeers.map((likedBeer) => likedBeer.beer),
    };
  }

  async likeBeer(jwtUserId: number, userId: number, beerId: number) {
    if (jwtUserId !== userId) {
      throw new UnauthorizedException();
    }
    try {
      return await this.prisma.usersBeersLikes.create({
        data: {
          userId,
          beerId,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002')
          throw new BadRequestException('User has already liked beer');
        if (err.code === 'P2003') throw new BadRequestException();
      }
      throw new Error();
    }
  }

  async dislikeBeer(jwtUserId: number, userId: number, beerId: number) {
    if (jwtUserId !== userId) {
      throw new UnauthorizedException();
    }
    try {
      return await this.prisma.usersBeersLikes.delete({
        where: {
          userId_beerId: {
            userId,
            beerId,
          },
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025')
          throw new BadRequestException('Record does not exist');
      }
      throw new Error();
    }
  }

  async getUserRatedBeers(id: number) {
    const ratedBeers = await this.prisma.usersBeersRatings.findMany({
      where: { userId: id },
      select: {
        beer: true,
      },
    });

    if (!ratedBeers.length) {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      return [];
    }

    return {
      total: ratedBeers.length,
      rated_beers: ratedBeers.map((b) => b.beer),
    };
  }

  async rateBeer(
    jwtUserId: number,
    userId: number,
    beerId: number,
    dto: RateBeerDto,
  ) {
    if (jwtUserId !== userId) {
      throw new UnauthorizedException();
    }
    try {
      return await this.prisma.usersBeersRatings.upsert({
        where: {
          userId_beerId: {
            userId,
            beerId,
          },
        },
        update: { rating: dto.rating },
        create: { userId, beerId, rating: dto.rating },
        select: {
          rating: true,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2003') throw new BadRequestException();
        if (err.code === 'P2025')
          throw new BadRequestException('Record does not exist');
      }
    }
  }

  async unrateBeer(jwtUserId: number, userId: number, beerId: number) {
    if (jwtUserId !== userId) {
      throw new UnauthorizedException();
    }
    try {
      await this.prisma.usersBeersRatings.delete({
        where: {
          userId_beerId: {
            userId,
            beerId,
          },
        },
      });

      return { message: 'Rating has been deleted', data: { rated: false } };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') throw new BadRequestException();
      }
    }
  }
}
