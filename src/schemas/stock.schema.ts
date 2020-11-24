import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type StockDocument = Stock & Document;

@Schema({ minimize: true })
export class Stock {
  @ApiProperty()
  @Prop({ alias: 'ticker', unique: true })
  Ticker: string;

  @ApiPropertyOptional()
  @Prop()
  ProfitMargin: number;

  @ApiPropertyOptional()
  @Prop()
  Company: string;

  @ApiPropertyOptional()
  @Prop()
  Sector: string;

  @ApiPropertyOptional()
  @Prop()
  FiftyDayHigh: number;

  @ApiPropertyOptional()
  @Prop()
  FiftyDayLow: number;

  @ApiPropertyOptional()
  @Prop()
  Price: number;

  @ApiPropertyOptional()
  @Prop()
  Change: number;

  @ApiPropertyOptional()
  @Prop()
  MarketCap: number;

  constructor(data: Pick<Stock, 'Ticker'>) {
    Object.assign(this, data);
  }
}

export const StockSchema = SchemaFactory.createForClass(Stock);
