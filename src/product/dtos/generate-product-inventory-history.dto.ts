import { PickType } from '@nestjs/swagger';
import { ProductInventoryHistory } from '../entities/product-inventory-history.entity';
import { Product } from '../entities/product.entity';

export class GenerateProductInventoryHistoryDto extends PickType(
  ProductInventoryHistory,
  ['recevingShippingAmount', 'recevingShippingType'],
) {
  product: Product;
}
