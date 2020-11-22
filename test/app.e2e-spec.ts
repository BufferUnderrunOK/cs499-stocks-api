import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as mongoUnit from 'mongo-unit';
import { AppModule } from './../src/app.module';

jest.setTimeout(30000);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async (done) => {
    const url = await mongoUnit.start({
      dbName: 'test',
      verbose: true
    });
    process.env.MONGO_URL = url;

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
    await mongoUnit.load({
      stocks: [
        {
          Ticker: 'A'
        }
      ]
    });
    return await request(app.getHttpServer())
      .get('/stocks/api/v1.0/A')
      .expect(200)
      .expect('');
  });

  it('gets 404 when it cannot retrieve a stock by ticker symbol', async () => {
    return await request(app.getHttpServer())
      .get('/stocks/api/v1.0/A')
      .expect(404);
  });

});
