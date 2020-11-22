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

  /**
   * Determines if there is a property on an incoming Stock that is new or different from an existing one
   * @param existing must be a Stock retrieved from MongoDB through Mongoose
   * @param stock payload coming in from controller
   */
  isDifference(existing: Stock, stock: Stock): boolean {
    const existingDoc = existing as StockDocument;    
    for (let [key, value] of Object.entries(stock)) {
    if(!existingDoc[key] || value !== existingDoc[key]) {
        return true;
      }
    }
  }

  private getTickerFilter(ticker: string) {
    return new Stock({
      Ticker: ticker,
    });
  }
}
