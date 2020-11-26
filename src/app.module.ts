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
        entities: ["dist/**/*.entity{.ts,.js}"],
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepConnectionAlive: true
      })
    }),
    StocksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
