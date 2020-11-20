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
      .findOne(this.getTickerFilter(searchTicker));
  }

  async create(ticker: string): Promise<Stock> {
    const stockDoc = this.getTickerFilter(ticker);
    return await this.stockModel.create(stockDoc, {});
  }

  async update(ticker: string, stock: Stock): Promise<Stock> {
    return await this.stockModel
      .update(this.getTickerFilter(ticker), stock);
  }

  async delete(ticker: string) {
    return await this.stockModel
      .findOneAndDelete(this.getTickerFilter(ticker));
  }

  private getTickerFilter(ticker: string) {
    return new Stock({
      Ticker: ticker,
    });
  }
}
