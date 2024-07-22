import { Beer } from '@prisma/client';

export class BeerEntity implements Beer {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
