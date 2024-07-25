import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeersModule } from './beers/beers.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersBeersLikesModule } from './userslikedbeers/users-beers-likes.module';
import { UsersBeersRatingsModule } from './ratings/users-beers-ratings.module';

@Module({
  imports: [
    BeersModule,
    UsersModule,
    AuthModule,
    PrismaModule,
    UsersBeersLikesModule,
    UsersBeersRatingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
