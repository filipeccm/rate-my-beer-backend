import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserslikedbeersService {
  constructor(private prisma: PrismaService) {}
  async likeBeer(userId: number, beerId: number) {
    try {
      return await this.prisma.usersLikedBeers.create({
        data: {
          userId,
          beerId,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2003') throw new BadRequestException();
      }
    }
  }

  async dislikeBeer(userId: number, beerId: number) {
    try {
      return await this.prisma.usersLikedBeers.delete({
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
          throw new NotFoundException('Record does not exist');
      }
    }
  }
}
