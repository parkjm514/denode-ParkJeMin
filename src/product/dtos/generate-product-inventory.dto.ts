import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProductInventory } from '../entities/product-inventory.entity';
import { Product } from '../entities/product.entity';
import { IsOptional } from 'class-validator';

export class GenerateProductInventoryDto extends PickType(ProductInventory, [
  'inventoryExpiredAt',
  'remainingInventoryAmount',
]) {
  @ApiProperty({
    required: true,
    description: '제품 ID',
    example: 1,
  })
  @IsOptional()
  productId: number;

  product?: Product;
}
