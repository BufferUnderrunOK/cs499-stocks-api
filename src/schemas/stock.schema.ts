import { Schema } from '@nestjs/mongoose';

import { Prop, PropOptions, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockDocument = Stock & Document;

@Schema()
export class Stock {
  @Prop()
  ticker: string;

  @Prop()
  profitMargin: number;

  @Prop()
  company: string;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
