import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBeerRatingDto } from './dto/create-beer-rating.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DeleteBeerRatingDto } from './dto/delete-beer-rating.dto';
import { UpdateBeerRatingDto } from './dto/update-beer-rating.dto';

@Injectable()
export class UsersBeersRatingsService {
  constructor(private prisma: PrismaService) {}
  async createRating(userId: number, dto: CreateBeerRatingDto) {
    try {
      return await this.prisma.usersBeersRatings.create({
        data: {
          userId,
          beerId: dto.beerId,
          rating: dto.rating,
        },
        select: {
          rating: true,
        },
      });
    } catch (err) {
      console.log({ err });
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2003') throw new BadRequestException();
      }
    }
  }

  async updateRating(userId: number, dto: UpdateBeerRatingDto) {
    try {
      return await this.prisma.usersBeersRatings.update({
        where: {
          userId_beerId: {
            userId,
            beerId: dto.beerId,
          },
        },
        data: { rating: dto.rating },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') throw new BadRequestException();
      }
    }
  }

  async deleteRating(userId: number, dto: DeleteBeerRatingDto) {
    try {
      await this.prisma.usersBeersRatings.delete({
        where: {
          userId_beerId: {
            userId,
            beerId: dto.beerId,
          },
        },
      });

      return { message: 'Rating has been deleted' };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') throw new BadRequestException();
      }
    }
  }
}
