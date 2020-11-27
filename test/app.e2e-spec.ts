import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import * as supertest from 'supertest';
import * as mongoUnit from 'mongo-unit';
import { AppModule } from '../src/app.module';

jest.setTimeout(30000); // mongo startup takes about 10seconds

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const appPrefix = '/stocks/api/v1.1';

  beforeAll(async (done) => {
    const url = await mongoUnit.start({
      dbName: 'test',
      port: 28018,
      verbose: true
    });
    process.env.MONGO_URL = url;
    done();
  });

  beforeEach(async (done) => {
    await mongoUnit.load({
      stocks: [
        {
          Ticker: 'A',
          ProfitMargin: 270000,
          Company: 'Agile Acceptable Co.'
        }
      ]
    });
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
        
    app = moduleFixture.createNestApplication();
    await app.listen(3333);
    await app.init();

    expect(app).toBeTruthy(); // ensures the application started smoothly

    done();
  });

  afterEach(async () => {
    await mongoUnit.drop();
    await app.close();
  });
  afterAll(async() => await mongoUnit.stop());

  it('can retrieve a stock by ticker symbol', async () => {
    const response = await supertest(app.getHttpServer())
      .get(`${appPrefix}/stock/A`);

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body.Company).toBe('Agile Acceptable Co.');
  });

  it('gets HttpStatus.NOT_FOUND when it cannot retrieve a stock by ticker symbol', async () => {
    const response = await supertest(app.getHttpServer())
      .get(`${appPrefix}/stock/B`);

    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
  });

  it('POST can create a record', async () => {
    let response = await supertest(app.getHttpServer())
      .post(`${appPrefix}/stock/C`);

    expect(response.status).toEqual(HttpStatus.CREATED);
    
    response = await supertest(app.getHttpServer())
      .get(`${appPrefix}/stock/C`);

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body.Ticker).toBe('C');
  });

  it('POST requires a Ticker symbol param to create a record', async () => {
    let response = await supertest(app.getHttpServer())
      .post(`${appPrefix}/stock/`);

    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    
    response = await supertest(app.getHttpServer())
      .get(`${appPrefix}/stock/C`);

    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    expect(response.body.Ticker).toBeUndefined();
  });

  // PUT

  it('PUT can update a stock record', async () => {
    const stock = {
      Company: 'Jumpin Jesophat Co.'
    };
    let response = await supertest(app.getHttpServer())
      .put(`${appPrefix}/stock/A`)
      .send(stock);

    expect(response.status).toEqual(HttpStatus.OK);
    
    response = await supertest(app.getHttpServer())
      .get(`${appPrefix}/stock/A`);

      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body.Ticker).toBe('A');
      expect(response.body.Company).toBe(stock.Company);
    });

    it('PUT ignores repeated update / is idempotent', async () => {
      const stock = {
        Company: 'Jumpin Jesophat Co.'
      };
      let response = await supertest(app.getHttpServer())
        .put(`${appPrefix}/stock/A`)
        .send(stock);
  
      expect(response.status).toEqual(HttpStatus.OK);
      
      response = await supertest(app.getHttpServer())
      .put(`${appPrefix}/stock/A`)
      .send(stock);

      expect(response.status).toEqual(HttpStatus.NOT_MODIFIED);
    });

    it('DELETE removes document successfully', async () => {
      let response = await supertest(app.getHttpServer())
        .delete(`${appPrefix}/stock/A`);
  
      expect(response.status).toEqual(HttpStatus.OK);

      response = await supertest(app.getHttpServer())
      .get(`${appPrefix}/stock/A`);

      expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it('DELETE returns not found if no ticker matches', async () => {
      let response = await supertest(app.getHttpServer())
        .delete(`${appPrefix}/stock/B`);
  
      expect(response.status).toEqual(HttpStatus.NOT_FOUND);

    });

});
