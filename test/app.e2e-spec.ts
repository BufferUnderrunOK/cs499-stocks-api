import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import * as mongoUnit from 'mongo-unit';
import { AppModule } from './../src/app.module';

jest.setTimeout(30000); // mongo startup takes about 10seconds

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async (done) => {
    const url = await mongoUnit.start({
      dbName: 'test',
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
    await app.init();

    done();
  });

  afterEach(() => mongoUnit.drop());
  afterAll(() => mongoUnit.stop());

  it('can retrieve a stock by ticker symbol', async () => {
    const response = await supertest(app.getHttpServer())
      .get('/stocks/api/v1.0/A');

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body.Company).toBe('Agile Acceptable Co.');
  });

  it('gets HttpStatus.NOT_FOUND when it cannot retrieve a stock by ticker symbol', async () => {
    const response = await supertest(app.getHttpServer())
      .get('/stocks/api/v1.0/B');

    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
  });

  it('POST can create a record', async () => {
    let response = await supertest(app.getHttpServer())
      .post('/stocks/api/v1.0/C');

    expect(response.status).toEqual(HttpStatus.CREATED);
    
    response = await supertest(app.getHttpServer())
      .get('/stocks/api/v1.0/C');

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body.Ticker).toBe('C');
  });

  it('POST requires a Ticker symbol param to create a record', async () => {
    let response = await supertest(app.getHttpServer())
      .post('/stocks/api/v1.0');

    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    
    response = await supertest(app.getHttpServer())
      .get('/stocks/api/v1.0/C');

    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    expect(response.body.Ticker).toBeUndefined();
  });

  // PUT

  it('PUT can update a stock record', async () => {
    const stock = {
      Company: 'Jumpin Jesophat Co.'
    };
    let response = await supertest(app.getHttpServer())
      .put('/stocks/api/v1.0/A')
      .send(stock);

    expect(response.status).toEqual(HttpStatus.OK);
    
    response = await supertest(app.getHttpServer())
      .get('/stocks/api/v1.0/A');

      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body.Ticker).toBe('A');
      expect(response.body.Company).toBe(stock.Company);
    });

    it('PUT ignores repeated update / is idempotent', async () => {
      const stock = {
        Company: 'Jumpin Jesophat Co.'
      };
      let response = await supertest(app.getHttpServer())
        .put('/stocks/api/v1.0/A')
        .send(stock);
  
      expect(response.status).toEqual(HttpStatus.OK);
      
      response = await supertest(app.getHttpServer())
      .put('/stocks/api/v1.0/A')
      .send(stock);

      expect(response.status).toEqual(HttpStatus.NOT_MODIFIED);
    });

    it('DELETE removes document successfully', async () => {
      let response = await supertest(app.getHttpServer())
        .delete('/stocks/api/v1.0/A');
  
      expect(response.status).toEqual(HttpStatus.OK);

      response = await supertest(app.getHttpServer())
      .get('/stocks/api/v1.0/A');

      expect(response.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it('DELETE returns not found if no ticker matches', async () => {
      let response = await supertest(app.getHttpServer())
        .delete('/stocks/api/v1.0/B');
  
      expect(response.status).toEqual(HttpStatus.NOT_FOUND);

    });

});
