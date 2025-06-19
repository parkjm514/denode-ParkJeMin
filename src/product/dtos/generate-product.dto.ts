import { PickType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class GenerateProductDto extends PickType(Product, [
  'productName',
  'productDescription',
]) {}
