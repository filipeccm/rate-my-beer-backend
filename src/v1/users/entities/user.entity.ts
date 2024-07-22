import { ApiHideProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  @ApiHideProperty()
  hash: string;
}
