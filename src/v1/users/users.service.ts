import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

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
        beers: {
          select: {
            beer: true,
          },
        },
      },
    });

    return user;
  }
}
