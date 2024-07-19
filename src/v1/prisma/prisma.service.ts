import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([
      this.usersLikedBeers.deleteMany(),
      this.beer.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
