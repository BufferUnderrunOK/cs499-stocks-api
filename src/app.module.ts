import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'default',
      useFactory: () => ({
        type: ('mongodb' as 'mongodb'),
        url: process.env.MONGO_URL || 'mongodb://localhost/market',
        loggerLevel: 'error',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepConnectionAlive: true,
        autoLoadEntities: true
      })
    }),
    StocksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
