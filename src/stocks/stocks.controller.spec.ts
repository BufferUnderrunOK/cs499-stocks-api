import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Stock } from '../schemas/stock.schema';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

jest.mock('./stocks.service');

const stock = new Stock({
  Ticker: 'foo'
});

describe('StocksController', () => {
  let controller: StocksController;
  const MockModel = require("jest-mongoose-mock");
  const mockService: jest.Mocked<StocksService> = new StocksService(MockModel) as any;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: StocksService, useValue: mockService }
      ],
      controllers: [StocksController],
    }).compile();

    controller = module.get<StocksController>(StocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined(); 
  });

  it('should call service read on read', async () => {
    await controller.read('read-me');
    expect(mockService.get).toHaveBeenCalledWith('read-me');
  });

  it('should call service create on create', async () => {
    await controller.create('create-me');
    expect(mockService.create).toHaveBeenCalledWith('create-me');
  });

  it('should throw exception if duplicate on create', async () => {
    mockService.get.mockResolvedValue(stock);
    try {
      await controller.create('foobar');
    } catch (ConflictException) {
      expect(mockService.create).not.toHaveBeenCalled();
    }    
  });

  it('should call service update on update', async () => {
    mockService.isDifference.mockReturnValue(true);
    await controller.update('foobar', stock);
    expect(mockService.update).toHaveBeenCalled();
  });

  it('should NOT call service update if not modified', async () => {
    mockService.isDifference.mockReturnValue(false);
    try {
        await controller.update('foobar', stock);
    } catch (ex) {
      expect(ex).toBeInstanceOf(HttpException);
      expect(ex.status).toBe(HttpStatus.NOT_MODIFIED);      
    } 
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it('should call service delete on delete', async () => {
    await controller.delete('delete-me');
    expect(mockService.delete).toHaveBeenCalledWith('delete-me');
  });
});