import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotFoundInterceptor } from '../notfound.interceptor';
import { Stock } from '../entities/stock.entity';
import { StocksService } from './stocks.service';

const prefixSpecified = 'stocks/api/v1.1';

@ApiTags("Barrett W Nuzum's Stock API")
@Controller(prefixSpecified)
@UseInterceptors(NotFoundInterceptor)
export class StocksController {
  static BASIC_CRUD =
    'Enable specific CRUD functionality in a developed RESTful API framework. Use the example URIs linked in the prompt.';
  static REPORTING =
    'Enable advanced lookup functionality using the MongoDB Aggregation Framework';
  constructor(private readonly stocksService: StocksService) { }

  @Get('stock/:ticker')
  @ApiOperation({
    summary: 'Retrieve stock document for a given ticker symbol',
    description: StocksController.BASIC_CRUD,
  })
  async read(@Param('ticker') ticker: string): Promise<Stock> {
    return await this.stocksService.get(ticker);
  }

  @Post('stock/:ticker')
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

  @Put('stock/:ticker')
  @ApiOperation({
    summary:
      'Update a stock document for a ticker symbol, from data provided with the body.',
    description: StocksController.BASIC_CRUD,
  })
  async update(
    @Param('ticker') ticker: string,
    @Body() stock: Stock,
  ): Promise<Stock> {
    const existing = await this.stocksService.get(ticker.trim());
    if (!existing) {
      throw new NotFoundException();
    }

    if (!this.stocksService.isDifference(existing, stock)) {
      throw new HttpException('Not Modified', HttpStatus.NOT_MODIFIED);
    }

    return await this.stocksService.update(ticker, stock);
  }

  @Delete('stock/:ticker')
  @ApiOperation({
    summary: 'Delete a stock document for a ticker symbol',
    description: StocksController.BASIC_CRUD,
  })
  async delete(@Param('ticker') ticker: string) {
    return await this.stocksService.delete(ticker);
  }

  @Post('stockReport')
  @ApiOperation({
    operationId: 'stockReport',
    summary: 'Select and present specific stock summary information by a user-derived list of ticker symbols.',
    description: StocksController.REPORTING,    
  })
  async stockReport(
    @Body() list: string[]
  ): Promise<Stock[]> {
    return await this.stocksService.retrieveSummaries(list);
  }

  @Post('industryReport/:industry')
  @ApiOperation({
    operationId: 'industryReport',
    summary: 'Report a portfolio of five top stocks by a user-derived industry selection.',
    description: StocksController.REPORTING,    
  })
  async industryReport(
    @Param('industry') industry: string
  ): Promise<Stock[]> {
    return await this.stocksService.retrieveTopFiveForIndustry(industry);
  }

}
