import { PickType, PartialType, ApiProperty } from '@nestjs/swagger';
import { ProductInventory } from '../entities/product-inventory.entity';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ModifyProductInventoryDto extends PartialType(
  PickType(ProductInventory, ['remainingInventoryAmount']),
) {
  @ApiProperty({
    required: true,
    example: 1,
    description: '제품 ID',
  })
  @Type(() => Number)
  @IsOptional()
  productId: number;
}
