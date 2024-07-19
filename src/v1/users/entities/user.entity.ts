import { User as PrismaUser, UsersLikedBeers } from '@prisma/client';

export class User implements PrismaUser {
  id: number;
  email: string;
  name: string;
  beers?: UsersLikedBeers[];
  updatedAt: Date;
  createdAt: Date;
  hash: string;
}
