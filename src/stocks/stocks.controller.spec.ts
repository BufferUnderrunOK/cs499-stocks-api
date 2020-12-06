import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Stock } from '../entities/stock.entity';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import * as repo from './mock.repository';
import { getRepositoryToken } from '@nestjs/typeorm';

const stock = new Stock({
  ticker: 'foo'
});

describe('StocksController', () => {
  let controller: StocksController;
  let service: StocksService;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(Stock), useFactory: repo.repositoryMockFactory },
        { provide: StocksService, useClass: StocksService }
      ],
      controllers: [StocksController],
    }).compile();

    controller = module.get<StocksController>(StocksController);
    service = module.get(StocksService);

    jest.spyOn(service, 'find').mockResolvedValue(stock);
    jest.spyOn(service, 'create').mockResolvedValue(stock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service read on read', async () => {
    await controller.read('read-me');
    expect(service.find).toHaveBeenCalled();
  });

  it('should call service create on create', async () => {
    jest.resetAllMocks();    
    await controller.create('create-me');
    expect(service.create).toHaveBeenCalled();
  });

  it('should throw exception if duplicate on create', async () => {
    stock.ticker = 'foobar';    
    try {
      await controller.create('foobar');
    } catch (ConflictException) {
      expect(service.create).not.toHaveBeenCalled();
    }
  });

  it('should call service update on update', async () => {
    jest.spyOn(service, 'update').mockResolvedValue(stock);
    jest.spyOn(service, 'isDifference').mockReturnValue(true);
    await controller.update('foobar', stock);
    expect(service.update).toHaveBeenCalled();
  });

  it('should NOT call service update if not modified', async () => {
    jest.spyOn(service, 'update').mockResolvedValue(stock);
    jest.spyOn(service, 'isDifference').mockReturnValue(false);
    try {
      await controller.update('foobar', stock);
    } catch (ex) {
      expect(ex).toBeInstanceOf(HttpException);
      expect(ex.status).toBe(HttpStatus.NOT_MODIFIED);
    }
    expect(service.update).not.toHaveBeenCalled();
  });

  it('should call service delete on delete', async () => {
    jest.spyOn(service, 'delete').mockResolvedValue(1);
    await controller.delete('delete-me');
    expect(service.delete).toHaveBeenCalled();
  });
});