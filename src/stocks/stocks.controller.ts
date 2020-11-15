import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotFoundInterceptor } from 'src/notfound.interceptor';
import { Stock } from 'src/schemas/stock.schema';
import { StocksService } from './stocks.service';

const prefixSpecified = 'stocks/api/v1.0';

@ApiTags("Barrett W Nuzum's Stock API")
@Controller(prefixSpecified)
@UseInterceptors(NotFoundInterceptor)
export class StocksController {
  static BASIC_CRUD =
    'Enable specific CRUD functionality in a developed RESTful API framework. Use the example URIs linked in the prompt.';
  constructor(private readonly stocksService: StocksService) {}

  @Get(':ticker')
  @ApiOperation({
    summary: 'Retrieve stock document for a given ticker symbol',
    description: StocksController.BASIC_CRUD,
  })
  async read(@Param('ticker') ticker: string): Promise<Stock> {
    return await this.stocksService.get(ticker);
  }

  @Post(':ticker')
  @ApiOperation({
    summary:
      'Create new stock document for a ticker symbol, from data provided with the request.',
    description: StocksController.BASIC_CRUD,
  })
  async create(@Param('ticker') ticker: string): Promise<Stock> {
    const existing = await this.stocksService.get(ticker.trim());
    if (existing) {
      throw new ConflictException(existing);
    }
    return await this.stocksService.create(ticker.trim());
  }

  @Put(':ticker')
  @ApiOperation({
    summary:
      'Update a stock document for a ticker symbol, from data provided with the body.',
    description: StocksController.BASIC_CRUD,
  })
  async update(
    @Param('ticker') ticker: string,
    @Body() stock: Stock,
  ): Promise<Stock> {
    return await this.stocksService.update(ticker, stock);
  }

  @Delete(':ticker')
  @ApiOperation({
    summary: 'Delete a stock document for a ticker symbol',
    description: StocksController.BASIC_CRUD,
  })
  async delete(@Param('ticker') ticker: string) {
    return await this.stocksService.delete(ticker);
  }
}
