import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiExtraModels } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@ApiExtraModels(UserEntity)
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@GetUser('id') id: number) {
    return this.usersService.getMe(id);
  }

  @Patch()
  update(@GetUser('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
