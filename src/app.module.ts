import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeersModule } from './v1/beers/beers.module';
import { UsersModule } from './v1/users/users.module';
import { AuthModule } from './v1/auth/auth.module';
import { PrismaModule } from './v1/prisma/prisma.module';

@Module({
  imports: [BeersModule, UsersModule, AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
