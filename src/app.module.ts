import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StocksModule } from './stocks/stocks.module';

 @Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost/market', {
      loggerLevel: process.env.LOG_LEVEL || 'info',
    }),
    StocksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
