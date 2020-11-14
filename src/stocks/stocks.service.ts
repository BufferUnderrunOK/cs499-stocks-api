import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Stock, StockDocument } from '../schemas/stock.schema';

@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<StockDocument>,
  ) {}

  async get(searchTicker: string): Promise<Stock> {
    return await this.stockModel
      .findOne({
        Ticker: searchTicker,
      })
      .exec();
  }
}
