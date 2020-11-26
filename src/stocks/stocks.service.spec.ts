import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Stock } from '../entities/stock.entity';
import { StocksService } from './stocks.service';
import * as repo from './mock.repository';


describe('StocksService', () => {
  let service: StocksService;
  let repositoryMock: MongoRepository<Stock>;

  const stock = new Stock({
    ticker: 'mock'
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(Stock), useFactory: repo.repositoryMockFactory },
        StocksService],
    })
      .compile();

    service = module.get<StocksService>(StocksService);
    repositoryMock = module.get<MongoRepository<Stock>>(getRepositoryToken(Stock));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findOne from get', async () => {
    await service.find('mock');
    expect(repositoryMock.findOne).toHaveBeenCalled();
  });

  it('should call create from create', async () => {
    await service.create('mock');
    expect(repositoryMock.create).toHaveBeenCalled();
  });

  it('should call update from update', async () => {        
    await service.update('mock', new Stock({
      ticker: 'not-relevant'
    }));
    expect(repositoryMock.findOneAndUpdate).toHaveBeenCalled();
  });

  it('should call findOneAndDelete from delete', async () => {
    await service.delete('mock');
    expect(repositoryMock.findOneAndDelete).toHaveBeenCalled();
  });

});
