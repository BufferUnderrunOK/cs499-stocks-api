import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URL || 'mongodb://localhost/market',
        loggerLevel: process.env.LOG_LEVEL || 'info',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    }),
    StocksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
