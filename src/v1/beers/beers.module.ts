import { Module } from '@nestjs/common';
import { BeersService } from './beers.service';
import { BeersController } from './beers.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [BeersController],
  providers: [BeersService, PrismaService],
})
export class BeersModule {}
