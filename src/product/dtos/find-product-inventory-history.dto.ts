import { PickType, PartialType, ApiProperty } from '@nestjs/swagger';
import { ProductInventoryHistory } from '../entities/product-inventory-history.entity';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FindProductInventoryHistoryDto extends PartialType(
  PickType(ProductInventoryHistory, ['recevingShippingType']),
) {
  @ApiProperty({
    description: '제품 ID',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  productId?: number;
}
