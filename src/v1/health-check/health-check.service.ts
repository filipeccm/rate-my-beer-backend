import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthCheckService {
  constructor(private prisma: PrismaService) {}
  async checkHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { message: 'ok' };
    } catch (err) {
      throw new HttpException(
        'Sorry, the service is currently unavailable. Try again later',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
