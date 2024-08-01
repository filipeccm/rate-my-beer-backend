import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeersModule } from './beers/beers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import * as argon from 'argon2';
import { SeedModule } from './seed/seed.module';
import { HealthCheckMiddleware } from './middlewares/health-check/health-check.middleware';
import { HealthCheckModule } from './health-check/health-check.module';

@Module({
  imports: [
    BeersModule,
    UsersModule,
    AuthModule,
    PrismaModule,
    SeedModule,
    HealthCheckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit, NestModule {
  constructor(private prisma: PrismaService) {}
  async onModuleInit() {
    const pass = process.env.ADMIN_PASSWORD;
    const email = process.env.ADMIN_EMAIL;
    if (!pass || !email) throw new Error('can not initiate without an admin');

    try {
      const admin = await this.prisma.user.findUnique({
        where: { email },
      });
      if (admin) {
        return;
      }
      const hash = await argon.hash(pass);
      return this.prisma.user.create({
        data: {
          name: 'Admin',
          email,
          role: 'ADMIN',
          hash,
        },
      });
    } catch (err) {
      console.error('Could not initialize app');
      process.exit(1);
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HealthCheckMiddleware).forRoutes('*'); // Apply middleware to all routes
  }
}
