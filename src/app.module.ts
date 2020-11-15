import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/market', {
      loggerLevel: 'debug',
    }),
    StocksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
