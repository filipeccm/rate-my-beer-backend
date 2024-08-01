import { BeerEntity } from '../entity/beer.entity';

export class OkResponse {
  total: number;
  count: number;
  offset: number;
  results: BeerEntity[];
}
