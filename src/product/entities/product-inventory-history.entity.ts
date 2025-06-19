import { CoreEntity } from 'src/shared/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RecevingShippingType } from '../product.constants';

@Entity({
  name: 'ProductInventoryHistory',
})
export class ProductInventoryHistory extends CoreEntity {
  @ManyToOne(() => Product, (product) => product.productInventoryHistories, {
    nullable: false,
  })
  @IsNotEmpty()
  product: Product;

  @ApiProperty({
    description: '입출고 수량',
    example: 10,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @Column({
    comment: '입출고 수량',
    type: 'int',
    nullable: false,
  })
  recevingShippingAmount: number;

  @IsEnum(RecevingShippingType)
  @Column({
    comment: '입출고 타입',
    type: 'enum',
    enum: RecevingShippingType,
    nullable: false,
  })
  recevingShippingType: RecevingShippingType;
}
