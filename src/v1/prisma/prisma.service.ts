import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({ log: ['info', 'error'] });
  }

  cleanDb() {
    return this.$transaction([
      this.usersLikedBeers.deleteMany(),
      this.beer.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
