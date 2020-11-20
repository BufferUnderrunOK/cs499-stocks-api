import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Stock } from '../schemas/stock.schema';
import { StocksService } from './stocks.service';

describe('StocksService', () => {
  let service: StocksService;

  const stock = new Stock({
    Ticker: 'mock'
  });

  class StockModel {
    constructor() { }
    static create = jest.fn().mockResolvedValue(stock);
    static findOne = jest.fn().mockResolvedValue(stock);
    static update = jest.fn().mockResolvedValue(stock);
    static findOneAndDelete = jest.fn().mockResolvedValue(stock);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken('Stock'), useValue: StockModel },
        StocksService],
    })
      .compile();

    service = module.get<StocksService>(StocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findOne from get', async () => {
    await service.get('mock');
    expect(StockModel.findOne).toHaveBeenCalled();
  });

  it('should call create from create', async () => {
    await service.create('mock');
    expect(StockModel.create).toHaveBeenCalled();
  });

  it('should call update from update', async () => {
    await service.update('mock', new Stock({
      Ticker: 'not-relevant'
    }));
    expect(StockModel.update).toHaveBeenCalled();
  });

  it('should call findOneAndDelete from delete', async () => {
    await service.delete('mock');
    expect(StockModel.findOneAndDelete).toHaveBeenCalled();
  });

});