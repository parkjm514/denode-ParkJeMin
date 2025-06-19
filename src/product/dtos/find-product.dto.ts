import { PartialType, PickType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FindProductDto extends PartialType(
  PickType(Product, ['productName']),
) {
  @Type(() => Number)
  @IsOptional()
  productId?: number;
}
