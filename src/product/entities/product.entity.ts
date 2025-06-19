import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/shared/entities/core.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { ProductInventory } from './product-inventory.entity';
import { ProductInventoryHistory } from './product-inventory-history.entity';

@Entity({ name: 'Product' })
@Unique('UNIQUE_PRODUCT_NAME', ['productName'])
export class Product extends CoreEntity {
  @OneToMany(
    () => ProductInventory,
    (productInventory) => productInventory.product,
    {
      nullable: true,
      eager: false,
      cascade: true,
    },
  )
  productInventories: ProductInventory;

  @OneToMany(
    () => ProductInventoryHistory,
    (productInventoryHistory) => productInventoryHistory.product,
    {
      nullable: true,
      eager: false,
      cascade: true,
    },
  )
  productInventoryHistories: ProductInventoryHistory;

  @ApiProperty({
    description: '상품명',
    example: '맛있는 커피',
    required: true,
  })
  @IsString()
  @Length(1, 100)
  @Column({
    comment: '상품명',
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  productName: string;

  @ApiProperty({
    description: '상품 설명',
    example: '맛있는 커피입니다.',
    required: true,
  })
  @IsString()
  @Length(1, 1000)
  @Column({
    comment: '상품 설명',
    type: 'varchar',
    nullable: false,
    length: 1000,
  })
  productDescription: string;
}
