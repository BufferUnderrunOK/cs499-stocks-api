import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type StockDocument = Stock & Document;

@Schema({ strict: true })
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

  constructor(data: Pick<Stock, 'Ticker'>) {
    Object.assign(this, data);
  }
}

export const StockSchema = SchemaFactory.createForClass(Stock);
