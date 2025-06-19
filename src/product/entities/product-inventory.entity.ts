import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { CoreEntity } from 'src/shared/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity({
  name: 'ProductInventory',
})
export class ProductInventory extends CoreEntity {
  @ManyToOne(() => Product, (product) => product.productInventories, {
    nullable: false,
  })
  @IsNotEmpty()
  product: Product;

  @ApiProperty({
    description: '재고 유통 기한',
    example: '2030-01-01T00:00:00.000z',
    required: true,
  })
  @Type(() => Date)
  @IsDate()
  @Column({
    comment: '재고 유통 기한',
    type: 'timestamp',
    nullable: false,
  })
  inventoryExpiredAt: Date;

  @ApiProperty({
    description: '잔여 재고 수',
    example: 10,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Column({
    comment: '잔여 재고 수',
    type: 'int',
    nullable: false,
  })
  remainingInventoryAmount: number;
}
