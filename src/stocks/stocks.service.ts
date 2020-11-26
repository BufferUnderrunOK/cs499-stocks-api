import { Injectable } from '@nestjs/common';
import { Stock } from '../entities/stock.entity'
import { Connection, getMongoRepository, MongoRepository, Repository } from 'typeorm';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StocksService {
  
  constructor(@InjectRepository(Stock) private readonly repository: MongoRepository<Stock>
  ) {
  }

  async find(searchTicker: string): Promise<Stock> {
    return await this.repository
      .findOne(this.getTickerFilter(searchTicker));
  }

  async create(ticker: string): Promise<Stock> {
    const stockDoc = this.getTickerFilter(ticker);
    return await this.repository.create(stockDoc);
  }

  async update(ticker: string, stock: Stock): Promise<Stock> {
    const result = await this.repository
      .findOneAndUpdate(this.getTickerFilter(ticker), stock, {returnOriginal: true});
      return result.value;
  }

  async delete(ticker: string): Promise<number> {
    let result = await this.repository
      .findOneAndDelete(this.getTickerFilter(ticker));
      return result.ok;
  }

  async countBySector(sector: string) {
    return await this.repository.aggregate([{
      "$match": {
        "Sector": new RegExp(sector, 'i')
      }
    },
    {
      "$group": {
        "_id": "$Industry",
        "totalOutstandingShares": {
          "$sum": "$Shares Outstanding"
        }
      }
    }
    ]).toArray();
  }

  async retrieveSummaries(tickerSymbols: string[]) : Promise<Stock[]> {
    return await this.repository.aggregateEntity([
      {
        "$match": {
          "Ticker": { $in: tickerSymbols }
        }
      },
      {
        "$sort":
        {
          "Ticker": 1
        }
      }
    ]).toArray();
  }

  async retrieveTopFiveForIndustry(industry: string) : Promise<Stock[]> {
    return await this.repository.aggregateEntity([
        { 
            "$match" : { 
                "Industry" : new RegExp(industry, 'i')
            }
        }, 
        { 
            "$sort" : { 
                "Market Cap" : -1.0
            }
        },
        {
          "$limit": 5.0
        }
    ]).toArray();
  }

  /**
   * Determines if there is a property on an incoming Stock that is new or different from an existing one
   * @param existing must be a Stock retrieved from MongoDB through Mongoose
   * @param stock payload coming in from controller
   */
  isDifference(existing: Stock, stock: Stock): boolean {
    const existingDoc = existing as Stock;
    for (let [key, value] of Object.entries(stock)) {
      if (!existingDoc[key] || value !== existingDoc[key]) {
        return true;
      }
    }
  }

  private getTickerFilter(tickerSymbol: string) {
    return new Stock({
      ticker: tickerSymbol,
    });
  }
}
