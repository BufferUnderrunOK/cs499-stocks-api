import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity({
    name: 'stocks'    
})
export class Stock {
    @ObjectIdColumn()
    id: ObjectID;

    @ApiProperty()
    @Column({ name: 'Ticker' })
    ticker: string;

    @ApiPropertyOptional()
    @Column({ name: 'Profit Margin' })
    profitMargin: number;

    @ApiPropertyOptional()
    @Column({ name: 'Company' })
    companyName: string;

    @ApiPropertyOptional()
    @Column({ name: 'Sector' })
    sector: string;

    @ApiPropertyOptional()
    @Column({ name: 'Industry' })
    industry: string;

    @ApiPropertyOptional()
    @Column({ name: '50-Day High' })
    fiftyDayHigh: number;

    @ApiPropertyOptional()
    @Column({ name: '50-Day Low' })
    fiftyDayLow: number;

    @ApiPropertyOptional()
    @Column({ name: 'Price'})
    price: number;

    @ApiPropertyOptional()
    @Column({name: 'Change'})
    change: number;

    @ApiPropertyOptional()
    @Column({name: 'Market Cap'})
    marketCap: number;

    constructor(data: Pick<Stock, 'ticker'>) {
        Object.assign(this, data);
    }
}
