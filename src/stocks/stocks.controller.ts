import { Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundInterceptor } from 'src/notfound.interceptor';
import { Stock } from 'src/schemas/stock.schema';
import { StocksService } from './stocks.service';

const prefixSpecified = 'stocks/api/v1.0';

@ApiTags("Barrett W Nuzum's Stock API")
@Controller(prefixSpecified)
@UseInterceptors(NotFoundInterceptor)
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get(':ticker')
  async read(@Param('ticker') ticker: string): Promise<Stock> {
    return await this.stocksService.get(ticker);
  }

  @Post(':ticker')
  async create(@Param('ticker') ticker: string): Promise<Stock> {
    return await this.stocksService.create(ticker.trim());
  }
}
