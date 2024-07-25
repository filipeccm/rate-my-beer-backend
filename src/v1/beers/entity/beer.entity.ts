import { Beer } from '@prisma/client';

export class BeerEntity implements Beer {
  id: number;
  name: string;
  abv: number;
  ibu: number;
  srm: number;
  upc: number;
  descript: string;
  brewery_id: number;
  cat_id: number;
  style_id: number;
  createdat: Date;
  updatedat: Date;
}
