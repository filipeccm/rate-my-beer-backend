import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Request, Response } from 'express';

@Injectable()
export class HealthCheckMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}
  async use(req: Request, res: Response, next: () => void) {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      next();
    } catch (err) {
      throw new HttpException(
        'Sorry, the service is currently unavailable. Try again later',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
