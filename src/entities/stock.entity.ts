import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

/**
 * These property names should start with a lower case character and be converted by the ORM to match the database.
 * They aren't, though. https://github.com/typeorm/typeorm/issues/1933
 */
@Entity({
    name: 'stocks'    
})
export class Stock {
    @ObjectIdColumn()
    id: ObjectID;

    @ApiProperty()
    @Column({ name: 'Ticker' })
    Ticker: string;

    @ApiPropertyOptional()
    @Column({ name: 'Profit Margin' })
    ProfitMargin: number;

    @ApiPropertyOptional()
    @Column({ name: 'Company' })
    Company: string;

    @ApiPropertyOptional()
    @Column({ name: 'Sector' })
    Sector: string;

    @ApiPropertyOptional()
    @Column({ name: 'Industry' })
    Industry: string;

    @ApiPropertyOptional()
    @Column({ name: '50-Day High' })
    FiftyDayHigh: number;

    @ApiPropertyOptional()
    @Column({ name: '50-Day Low' })
    FiftyDayLow: number;

    @ApiPropertyOptional()
    @Column({ name: 'Price'})
    Price: number;

    @ApiPropertyOptional()
    @Column({name: 'Change'})
    Change: number;

    @ApiPropertyOptional()
    @Column({name: 'Market Cap'})
    MarketCap: number;

    constructor(data: Pick<Stock, 'Ticker'>) {
        Object.assign(this, data);
    }
}
