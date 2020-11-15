import { Schema } from '@nestjs/mongoose';

import { Prop, PropOptions, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockDocument = Stock & Document;

@Schema({ strict: true })
export class Stock {
  @Prop({ alias: 'ticker' })
  Ticker: string;

  @Prop()
  profitMargin: number;

  @Prop()
  company: string;

  constructor(data: Pick<Stock, 'Ticker'>) {
    Object.assign(this, data);
  }
}

export const StockSchema = SchemaFactory.createForClass(Stock);
