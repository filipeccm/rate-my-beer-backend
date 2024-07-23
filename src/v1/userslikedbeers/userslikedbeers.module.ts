import { Module } from '@nestjs/common';
import { UserslikedbeersService } from './userslikedbeers.service';
import { UserslikedbeersController } from './userslikedbeers.controller';

@Module({
  providers: [UserslikedbeersService],
  controllers: [UserslikedbeersController],
})
export class UserslikedbeersModule {}
