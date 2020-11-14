import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Stock } from 'src/schemas/stock.schema';
import { StocksService } from './stocks.service';

const prefixSpecified = 'stocks/api/v1.0';

@ApiTags("Barrett W Nuzum's Stock API")
@Controller(prefixSpecified)
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get(':ticker')
  async read(@Param('ticker') ticker: string): Promise<Stock> {
    return await this.stocksService.get(ticker);
  }
}
