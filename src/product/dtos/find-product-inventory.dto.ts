import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProductInventory } from '../entities/product-inventory.entity';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindProductInventoryDto extends PickType(ProductInventory, []) {
  @ApiProperty({
    description: '제품 ID',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  productId?: number;

  isValidRemaining?: boolean;

  orderExpiredAt?: boolean;
}
